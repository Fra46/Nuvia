import api from './api';

const ENDPOINT = '/auth';

const persistSession = (data) => {
  const token = data?.accessToken || data?.token;

  if (token) {
    localStorage.setItem('token', token);
  }

  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

/**
 * Servicio para gestionar autenticación
 */
const authService = {
  requestMagicLink: async (email) => {
    try {
      const response = await api.post(`${ENDPOINT}/magic-link/request`, { email });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  confirmMagicLink: async (token) => {
    try {
      const response = await api.post(`${ENDPOINT}/magic-link/confirm`, { token });
      persistSession(response.data);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('token') || null,

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
