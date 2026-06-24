import api from './api';

const ENDPOINT = '/auth';

/**
 * Servicio para gestionar autenticación
 */
const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      const response = await api.post(`${ENDPOINT}/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await api.post(`${ENDPOINT}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Solicitar enlace mágico
  requestMagicLink: async (email) => {
    try {
      const response = await api.post(`${ENDPOINT}/magic-link`, { email });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Confirmar enlace mágico
  confirmMagicLink: async (token) => {
    try {
      const response = await api.post(`${ENDPOINT}/magic-link/confirm`, { token });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
