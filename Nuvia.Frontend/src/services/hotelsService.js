import api from './api';

const ENDPOINT = '/hotels';

/**
 * Servicio para gestionar hoteles
 */
const hotelsService = {
  // Obtener todos los hoteles
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener hotel por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo hotel
  create: async (hotelData) => {
    try {
      const response = await api.post(ENDPOINT, hotelData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar hotel
  update: async (id, hotelData) => {
    try {
      const response = await api.put(ENDPOINT, id, hotelData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar hotel
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default hotelsService;
