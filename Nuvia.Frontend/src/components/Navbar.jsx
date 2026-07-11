import React, { useState } from 'react';
import authService from '../services/authService';
import flightsService from '../services/flightsService';

export default function Navbar() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [flightCount, setFlightCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const flights = await flightsService.getAll();
      setFlightCount(flights?.length || 0);
      alert(`✓ Conexión exitosa. Se encontraron ${flights?.length || 0} vuelos.`);
    } catch (error) {
      alert(`✗ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <strong>Nuvia</strong> - Travel Booking
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-sm btn-info me-2"
                onClick={handleTestConnection}
                disabled={loading}
              >
                {loading ? 'Probando...' : 'Probar Conexión'}
              </button>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">
                      Hola, {user.email || 'Usuario'}
                    </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={handleLogout}
                  >
                      Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Iniciar Sesión
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {flightCount > 0 && (
        <div className="alert alert-success mb-0 mt-2">
          ✓ Axios está funcionando correctamente. {flightCount} vuelos disponibles.
        </div>
      )}
    </nav>
  );
}
