import api from './api';

const ENDPOINT = '/tours';

/**
 * Servicio para gestionar tours
 */
const toursService = {
  // Obtener todos los tours
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener tour por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo tour
  create: async (tourData) => {
    try {
      const response = await api.post(ENDPOINT, tourData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar tour
  update: async (id, tourData) => {
    try {
      const response = await api.put(ENDPOINT, id, tourData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar tour
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default toursService;
