import api from './api';

const ENDPOINT = '/users';

/**
 * Servicio para gestionar usuarios
 */
const usersService = {
  // Obtener todos los usuarios
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener usuario por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo usuario
  create: async (userData) => {
    try {
      const response = await api.post(ENDPOINT, userData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const response = await api.put(ENDPOINT, id, userData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default usersService;
