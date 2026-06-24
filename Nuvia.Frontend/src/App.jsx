import React from 'react'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container py-4">
        <div className="p-4 bg-light rounded-3">
          <h1 className="display-6">Bienvenido a Nuvia</h1>
          <p className="lead">Nuevo frontend con React + Vite + Bootstrap</p>
        </div>
      </main>
    </div>
  )
}
