import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loginWithMagicLink = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await authService.requestMagicLink(email);
      setMessage(result?.message || 'Revisa tu correo para continuar.');
      return result;
    } catch (err) {
      const messageText = err?.message || 'No se pudo enviar el enlace de acceso.';
      setError(messageText);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmMagicLink = useCallback(async (tokenValue) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await authService.confirmMagicLink(tokenValue);

      if (result?.accessToken || result?.token) {
        const nextUser = result?.user || authService.getCurrentUser();
        setToken(result?.accessToken || result?.token || null);
        setUser(nextUser);
      }

      return result;
    } catch (err) {
      const messageText = err?.message || 'No se pudo completar la autenticación.';
      setError(messageText);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setMessage(null);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    message,
    error,
    isAuthenticated: Boolean(token),
    setMessage,
    setError,
    loginWithMagicLink,
    confirmMagicLink,
    logout,
  }), [user, token, loading, message, error, loginWithMagicLink, confirmMagicLink, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
