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
    <main className="container-xl" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="nv-card p-4 p-md-5 text-center">
            <h1 className="font-heading fw-semibold fs-2 mb-2">Confirmando acceso</h1>
            <p className="text-muted-nv mb-0">
              {loading
                ? 'Validando tu enlace de acceso...'
                : isAuthenticated
                  ? 'Inicio de sesión completado.'
                  : 'Esperando el token de autenticación.'}
            </p>

            {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
