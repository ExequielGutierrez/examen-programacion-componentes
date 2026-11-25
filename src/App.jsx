import { Component } from 'react'
import { NavLink, Route, HashRouter as Router, Routes } from 'react-router-dom'
import Ejercicio1 from './pages/Ejercicio1.jsx'
import Ejercicio2 from './pages/Ejercicio2.jsx'
import Ejercicio3 from './pages/Ejercicio3.jsx'

class App extends Component {
  render() {
    return (
      <Router>
        <header className="border-bottom bg-white">
          <div className="container py-3">
            <p className="text-secondary text-uppercase small mb-2">Programación de Componentes · Examen</p>
            <nav className="nav nav-pills gap-2">
              <NavLink className="nav-link" to="/">Ejercicio 1</NavLink>
              <NavLink className="nav-link" to="/ejercicio-2">Ejercicio 2</NavLink>
              <NavLink className="nav-link" to="/ejercicio-3">Ejercicio 3</NavLink>
            </nav>
          </div>
        </header>
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Ejercicio1 />} />
            <Route path="/ejercicio-2" element={<Ejercicio2 />} />
            <Route path="/ejercicio-3" element={<Ejercicio3 />} />
          </Routes>
        </main>
      </Router>
    )
  }
}

export default App
