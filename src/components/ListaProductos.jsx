import React, { Component } from 'react'
import Producto from './Producto.jsx'

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Teclado mecánico', detalle: 'Switch rojo, cable USB', precio: 29990 },
  { id: 2, nombre: 'Mouse inalámbrico', detalle: 'Sensor óptico, 2.4 GHz', precio: 14990 },
  { id: 3, nombre: 'Audífonos', detalle: 'Diadema cerrada, micrófono', precio: 24990 },
  { id: 4, nombre: 'Hub USB-C', detalle: '4 puertos, aluminio', precio: 19990 },
]

// Padre: posee el catálogo y el carrito. El hijo no modifica el state directamente.
class ListaProductos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productos: PRODUCTOS_INICIALES,
      carrito: [],
    }
    this.agregarAlCarrito = this.agregarAlCarrito.bind(this)
    this.quitarDelCarrito = this.quitarDelCarrito.bind(this)
  }

  agregarAlCarrito(producto) {
    this.setState((estado) => ({
      carrito: [
        ...estado.carrito,
        { lineaId: `${producto.id}-${Date.now()}`, ...producto },
      ],
    }))
  }

  quitarDelCarrito(lineaId) {
    this.setState((estado) => ({
      carrito: estado.carrito.filter((item) => item.lineaId !== lineaId),
    }))
  }

  render() {
    const { productos, carrito } = this.state
    const total = carrito.reduce((suma, item) => suma + item.precio, 0)

    return (
      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="h4">Productos</h2>
          <div className="row g-3">
            {productos.map((producto) => (
              <div className="col-md-6" key={producto.id}>
                <Producto producto={producto} onAgregar={this.agregarAlCarrito} />
              </div>
            ))}
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h4 card-title">Carrito</h2>
              {carrito.length === 0 ? (
                <p className="text-secondary mb-0">El carrito está vacío.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {carrito.map((item) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                      key={item.lineaId}
                    >
                      <span>
                        {item.nombre}
                        <small className="d-block text-secondary">
                          ${item.precio.toLocaleString('es-CL')}
                        </small>
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => this.quitarDelCarrito(item.lineaId)}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="border-top pt-3 mt-3 mb-0">
                Total: <strong>${total.toLocaleString('es-CL')}</strong>
              </p>
            </div>
          </div>
        </aside>
      </div>
    )
  }
}

export default ListaProductos
