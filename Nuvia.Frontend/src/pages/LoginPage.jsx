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
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Acceso con magic link</h2>
            <p className="text-muted">
              Ingresa tu correo y recibirás un enlace para entrar sin contraseña.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
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

              <button type="submit" className="btn btn-primary" disabled={loading || !email.trim()}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
