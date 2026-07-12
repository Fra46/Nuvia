import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

function readSessionState() {
  return {
    user: authService.getCurrentUser(),
    token: authService.getToken(),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSessionState());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const syncSession = useCallback(() => {
    setSession(readSessionState());
  }, []);

  useEffect(() => {
    const handleSessionChange = () => syncSession();

    window.addEventListener('auth:changed', handleSessionChange);
    window.addEventListener('storage', handleSessionChange);

    // Debug: mostrar estado inicial de sesión
    try {
      const s = readSessionState();
      console.debug('[AuthContext] inicial session token?', !!s.token, 'user?', !!s.user);
    } catch (ex) {
      console.error('[AuthContext] error leyendo session inicial', ex);
    }

    return () => {
      window.removeEventListener('auth:changed', handleSessionChange);
      window.removeEventListener('storage', handleSessionChange);
    };
  }, [syncSession]);

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
        setSession({
          user: nextUser,
          token: result?.accessToken || result?.token || null,
        });
        window.dispatchEvent(new Event('auth:changed'));
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
    setSession({ user: null, token: null });
    setMessage(null);
    setError(null);
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  const value = useMemo(() => ({
    user: session.user,
    token: session.token,
    loading,
    message,
    error,
    isAuthenticated: Boolean(session.token),
    setMessage,
    setError,
    loginWithMagicLink,
    confirmMagicLink,
    logout,
  }), [session.user, session.token, loading, message, error, loginWithMagicLink, confirmMagicLink, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
