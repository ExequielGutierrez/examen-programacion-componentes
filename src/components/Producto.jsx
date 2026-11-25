import React, { Component } from 'react'

// Hijo: recibe el producto por props (padre → hijo) y avisa al padre con un callback (hijo → padre).
class Producto extends Component {
  render() {
    const { producto, onAgregar } = this.props

    return (
      <article className="card h-100">
        <div className="card-body d-flex flex-column">
          <h3 className="h5 card-title">{producto.nombre}</h3>
          <p className="card-text text-secondary flex-grow-1">{producto.detalle}</p>
          <div className="d-flex justify-content-between align-items-center">
            <strong>${producto.precio.toLocaleString('es-CL')}</strong>
            <button type="button" className="btn btn-dark" onClick={() => onAgregar(producto)}>
              Agregar
            </button>
          </div>
        </div>
      </article>
    )
  }
}

export default Producto
