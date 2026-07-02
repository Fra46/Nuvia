import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const { loginWithMagicLink, loading, message, error } = useAuth();

  const validateEmail = (emailStr) => {
    if (!emailStr || !emailStr.trim()) {
      return 'Por favor ingresa tu correo electrónico.';
    }

    const trimmedEmail = emailStr.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return 'Por favor ingresa un correo electrónico válido.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    const validation = validateEmail(email);
    if (validation) {
      setValidationError(validation);
      return;
    }

    try {
      await loginWithMagicLink(email.trim());
      setEmail('');
    } catch (err) {
      // El error se maneja en el contexto
    }
  };

  return (
    <main className="container-xl" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="nv-card p-4 p-md-5">
            <p className="text-uppercase-xs text-amber mb-2">Acceso</p>
            <h1 className="font-heading fw-semibold fs-2 mb-2">Acceso con magic link</h1>
            <p className="text-muted-nv">
              Ingresa tu correo y recibirás un enlace para entrar sin contraseña.
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="form-label text-uppercase-xs text-muted-nv" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control border-nv"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setValidationError('');
                  }}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
                {validationError && (
                  <small className="text-danger d-block mt-2">{validationError}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-teal rounded-pill px-4 w-100 fw-medium"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            {message && (
              <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: 'var(--nv-sand)', color: 'var(--nv-ink)' }}>
                {message}
              </div>
            )}
            {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
