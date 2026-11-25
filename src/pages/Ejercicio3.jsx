import { useEffect, useRef, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { auth, firebaseListo, storage } from '../firebase.js'

const sesionInicial = { correo: '', clave: '' }

function IconoOjo({ abierto }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {abierto && <path d="M4 20L20 4" />}
    </svg>
  )
}

function Ejercicio3() {
  const [sesion, setSesion] = useState(sesionInicial)
  const [usuario, setUsuario] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [archivos, setArchivos] = useState([])
  const [aviso, setAviso] = useState('')
  const [avisoArchivo, setAvisoArchivo] = useState('')
  const [esError, setEsError] = useState(false)
  const [errorArchivo, setErrorArchivo] = useState(false)
  const [verClave, setVerClave] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [menuArchivo, setMenuArchivo] = useState(null)
  const entradaArchivo = useRef(null)

  const avisarArchivo = (texto, error = false) => {
    setAvisoArchivo(texto)
    setErrorArchivo(error)
  }

  const conTiempo = (promesa, ms = 15000) => Promise.race([
    promesa,
    new Promise((_, reject) => {
      setTimeout(() => reject(Object.assign(new Error('tiempo'), { code: 'tiempo' })), ms)
    }),
  ])

  const mensajeStorage = (error) => {
    const codigo = error?.code || ''
    if (codigo.includes('unauthorized')) return 'Storage rechazó la operación. Revisa la sesión.'
    if (codigo === 'tiempo' || codigo.includes('retry-limit-exceeded') || codigo.includes('bucket-not-found') || codigo.includes('unknown')) {
      return 'Firebase Storage no está activo en este proyecto. Por eso la subida no termina ni avisa.'
    }
    return 'No se pudo completar la operación en Storage.'
  }

  const mostrar = (texto, error = false) => {
    setAviso(texto)
    setEsError(error)
  }

  const cargarArchivos = async (cuenta) => {
    if (!storage || !cuenta) {
      setArchivos([])
      return
    }
    const resultado = await listAll(ref(storage, `archivos/${cuenta.uid}`))
    const items = await Promise.all(resultado.items.map(async (item) => ({
      ruta: item.fullPath,
      nombre: item.name.replace(/^\d+-/, ''),
      url: await getDownloadURL(item),
    })))
    setArchivos(items)
  }

  useEffect(() => {
    if (!auth) return undefined
    return onAuthStateChanged(auth, (cuenta) => {
      setUsuario(cuenta)
      if (!cuenta) {
        setArchivos([])
        return
      }
      cargarArchivos(cuenta).catch((error) => avisarArchivo(mensajeStorage(error), true))
    })
  }, [])

  const alCambiar = ({ target: { name, value } }) => {
    setSesion((actual) => ({ ...actual, [name]: value }))
    mostrar('')
  }

  const credencialesValidas = () => {
    if (!sesion.correo.trim() || !sesion.clave) {
      mostrar('Correo o clave incorrectos.', true)
      return false
    }
    return true
  }

  const registrar = async (evento) => {
    evento.preventDefault()
    if (!auth || !credencialesValidas()) return
    setOcupado(true)
    mostrar('')
    try {
      await createUserWithEmailAndPassword(auth, sesion.correo.trim(), sesion.clave)
      setSesion(sesionInicial)
      mostrar('Cuenta creada e iniciada con Firebase Auth.')
    } catch {
      mostrar('No se pudo registrar. Usa un correo nuevo y una clave de 6 o más caracteres.', true)
    } finally {
      setOcupado(false)
    }
  }

  const ingresar = async (evento) => {
    evento.preventDefault()
    if (!auth || !credencialesValidas()) return
    setOcupado(true)
    mostrar('')
    try {
      await signInWithEmailAndPassword(auth, sesion.correo.trim(), sesion.clave)
      setSesion(sesionInicial)
      mostrar('Sesión iniciada.')
    } catch {
      mostrar('Correo o clave incorrectos.', true)
    } finally {
      setOcupado(false)
    }
  }

  const salir = async () => {
    await signOut(auth)
    mostrar('Sesión cerrada.')
  }

  const subir = async (evento) => {
    evento.preventDefault()
    if (!usuario || !archivo || !storage) return

    setSubiendo(true)
    avisarArchivo('Subiendo archivo…')
    try {
      const destino = ref(storage, `archivos/${usuario.uid}/${Date.now()}-${archivo.name}`)
      await conTiempo(uploadBytes(destino, archivo))
      setArchivo(null)
      if (entradaArchivo.current) entradaArchivo.current.value = ''
      await cargarArchivos(usuario)
      avisarArchivo('Archivo guardado en Firebase Storage.')
    } catch (error) {
      avisarArchivo(mensajeStorage(error), true)
    } finally {
      setSubiendo(false)
    }
  }

  const borrarArchivo = async (ruta) => {
    setMenuArchivo(null)
    if (!storage) return
    setSubiendo(true)
    try {
      await conTiempo(deleteObject(ref(storage, ruta)))
      setArchivos((actual) => actual.filter((item) => item.ruta !== ruta))
      avisarArchivo('Archivo eliminado.')
    } catch (error) {
      avisarArchivo(mensajeStorage(error), true)
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <section>
      <p className="text-secondary text-uppercase small mb-1">Unidad III · Bootstrap, Auth y Storage</p>
      <h1 className="h3 mb-4">Ejercicio 3 · Cuenta y archivos</h1>

      {!firebaseListo && (
        <div className="alert alert-warning">Falta la configuración web de Firebase en el archivo .env.</div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card card-body">
            <h2 className="h5">Firebase Auth</h2>
            {usuario ? (
              <>
                <p className="mb-3">Sesión de <strong>{usuario.email}</strong></p>
                <button type="button" className="btn btn-outline-dark" onClick={salir}>Cerrar sesión</button>
              </>
            ) : (
              <form>
                <label className="form-label" htmlFor="correo-auth">Correo</label>
                <input id="correo-auth" name="correo" type="email" className="form-control mb-3" value={sesion.correo} onChange={alCambiar} />
                <label className="form-label" htmlFor="clave">Clave</label>
                <div className="input-group mb-3">
                  <input
                    id="clave"
                    name="clave"
                    type={verClave ? 'text' : 'password'}
                    className="form-control"
                    value={sesion.clave}
                    onChange={alCambiar}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setVerClave((visible) => !visible)}
                    aria-label={verClave ? 'Ocultar clave' : 'Mostrar clave'}
                    aria-pressed={verClave}
                  >
                    <IconoOjo abierto={verClave} />
                  </button>
                </div>
                {aviso && (
                  <div className={`alert ${esError ? 'alert-danger' : 'alert-secondary'} py-2`} role="alert">
                    {aviso}
                  </div>
                )}
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-dark" disabled={ocupado} onClick={ingresar}>Ingresar</button>
                  <button type="button" className="btn btn-outline-dark" disabled={ocupado} onClick={registrar}>Crear cuenta</button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <form className="card card-body" onSubmit={subir}>
            <h2 className="h5">Firebase Storage</h2>
            <p className="text-secondary">La subida exige una sesión activa. El archivo queda en la ruta del usuario.</p>
            <input
              ref={entradaArchivo}
              className="form-control mb-3"
              type="file"
              onChange={(evento) => {
                setArchivo(evento.target.files?.[0] ?? null)
                avisarArchivo('')
              }}
              disabled={!usuario || subiendo}
            />
            <button type="submit" className="btn btn-dark" disabled={!usuario || !archivo || subiendo}>
              {subiendo ? 'Subiendo...' : 'Subir archivo'}
            </button>
            {avisoArchivo && (
              <div className={`alert ${errorArchivo ? 'alert-danger' : 'alert-success'} py-2 mt-3 mb-0`} role="alert">
                {avisoArchivo}
              </div>
            )}
            {usuario && (
              <div className="mt-3">
                <h3 className="h6">Tus archivos</h3>
                {archivos.length === 0 ? (
                  <p className="text-secondary small mb-0">Todavía no hay archivos.</p>
                ) : (
                  <div className="list-group">
                    {archivos.map((item) => (
                      <div className="list-group-item d-flex align-items-center gap-2" key={item.ruta}>
                        <a className="text-truncate flex-grow-1" href={item.url} target="_blank" rel="noreferrer">{item.nombre}</a>
                        <div className="dropdown">
                          <button
                            type="button"
                            className="btn btn-link text-dark text-decoration-none px-2 py-0 fs-4 lh-1"
                            aria-label="Opciones del archivo"
                            aria-expanded={menuArchivo === item.ruta}
                            onClick={() => setMenuArchivo((actual) => (actual === item.ruta ? null : item.ruta))}
                          >
                            ⋮
                          </button>
                          {menuArchivo === item.ruta && (
                            <div className="dropdown-menu dropdown-menu-end show">
                              <button type="button" className="dropdown-item" onClick={() => borrarArchivo(item.ruta)}>
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Ejercicio3
