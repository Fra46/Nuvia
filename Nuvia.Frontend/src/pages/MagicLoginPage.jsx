import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MagicLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmMagicLink, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      return;
    }

    const finishLogin = async () => {
      try {
        await confirmMagicLink(token);
        navigate('/');
      } catch {
        // El error ya se refleja en el contexto.
      }
    };

    finishLogin();
  }, [confirmMagicLink, location.search, navigate]);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Confirmando acceso</h2>
            <p className="text-muted">
              {loading
                ? 'Validando tu enlace de acceso...'
                : isAuthenticated
                  ? 'Inicio de sesión completado.'
                  : 'Esperando el token de autenticación.'}
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
