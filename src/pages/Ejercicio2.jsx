import { useEffect, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import SimpleReactValidator from 'simple-react-validator'
import { db, firebaseListo } from '../firebase.js'

const formularioInicial = { nombre: '', correo: '', mensaje: '' }

function Ejercicio2() {
  const [formulario, setFormulario] = useState(formularioInicial)
  const [registros, setRegistros] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(null)
  const [, forceUpdate] = useState(0)
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate((valor) => valor + 1) },
      messages: {
        required: 'Este campo es obligatorio.',
        email: 'Ingresa un correo válido.',
        min: 'Debe contener al menos :min caracteres.',
      },
    }),
  )

  useEffect(() => {
    if (!db) return undefined

    const consulta = query(collection(db, 'formularios'), orderBy('createdAt', 'desc'))
    return onSnapshot(consulta, (snapshot) => {
      setRegistros(snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() })))
    })
  }, [])

  const alCambiar = ({ target: { name, value } }) => {
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setAviso('')
  }

  const alEnviar = async (evento) => {
    evento.preventDefault()

    if (!validator.current.allValid()) {
      validator.current.showMessages()
      forceUpdate((valor) => valor + 1)
      return
    }

    if (!db) {
      setAviso('Firebase no está configurado. Revisa el archivo .env.')
      return
    }

    setGuardando(true)
    setAviso('')

    try {
      await addDoc(collection(db, 'formularios'), {
        nombre: formulario.nombre.trim(),
        correo: formulario.correo.trim(),
        mensaje: formulario.mensaje.trim(),
        createdAt: serverTimestamp(),
      })
      setFormulario(formularioInicial)
      validator.current.hideMessages()
      setAviso('El formulario quedó guardado en Firestore.')
    } catch {
      setAviso('No se pudo guardar en Firestore. Revisa las reglas y la configuración.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id) => {
    setMenuAbierto(null)
    if (!db) return
    try {
      await deleteDoc(doc(db, 'formularios', id))
      setAviso('Registro eliminado de Firestore.')
    } catch {
      setAviso('No se pudo eliminar el registro.')
    }
  }

  return (
    <section>
      <p className="text-secondary text-uppercase small mb-1">Unidad II · validación y Firestore</p>
      <h1 className="h3 mb-4">Ejercicio 2 · Formulario</h1>

      {!firebaseListo && (
        <div className="alert alert-warning">Falta la configuración web de Firebase en el archivo .env.</div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <form className="card card-body" onSubmit={alEnviar} noValidate>
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              className="form-control"
              value={formulario.nombre}
              onChange={alCambiar}
              onBlur={() => validator.current.showMessageFor('nombre')}
            />
            <div className="text-danger small mb-3">{validator.current.message('nombre', formulario.nombre, 'required|min:2')}</div>

            <label className="form-label" htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              className="form-control"
              value={formulario.correo}
              onChange={alCambiar}
              onBlur={() => validator.current.showMessageFor('correo')}
            />
            <div className="text-danger small mb-3">{validator.current.message('correo', formulario.correo, 'required|email')}</div>

            <label className="form-label" htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              className="form-control"
              rows="4"
              value={formulario.mensaje}
              onChange={alCambiar}
              onBlur={() => validator.current.showMessageFor('mensaje')}
            />
            <div className="text-danger small mb-3">{validator.current.message('mensaje', formulario.mensaje, 'required|min:10')}</div>

            <button type="submit" className="btn btn-dark" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar en Firestore'}
            </button>
            {aviso && <p className="mt-3 mb-0">{aviso}</p>}
          </form>
        </div>

        <div className="col-lg-7">
          <h2 className="h5">Registros</h2>
          {registros.length === 0 ? (
            <p className="text-secondary">Todavía no hay registros.</p>
          ) : (
            <div className="list-group">
              {registros.map((registro) => (
                <article className="list-group-item position-relative pe-5" key={registro.id}>
                  <div className="dropdown position-absolute top-0 end-0 mt-1 me-1">
                    <button
                      type="button"
                      className="btn btn-link text-dark text-decoration-none px-2 py-0 fs-4 lh-1"
                      aria-label="Opciones del registro"
                      aria-expanded={menuAbierto === registro.id}
                      onClick={() => setMenuAbierto((actual) => (actual === registro.id ? null : registro.id))}
                    >
                      ⋮
                    </button>
                    {menuAbierto === registro.id && (
                      <div className="dropdown-menu dropdown-menu-end show">
                        <button type="button" className="dropdown-item" onClick={() => eliminar(registro.id)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                  <strong>{registro.nombre}</strong>
                  <span className="d-block text-secondary small">{registro.correo}</span>
                  <p className="mb-0 mt-2">{registro.mensaje}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Ejercicio2
