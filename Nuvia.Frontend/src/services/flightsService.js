import api from './api';

const ENDPOINT = '/flights';

/**
 * Servicio para gestionar vuelos
 */
const flightsService = {
  // Obtener todos los vuelos
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener vuelo por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo vuelo
  create: async (flightData) => {
    try {
      const response = await api.post(ENDPOINT, flightData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar vuelo
  update: async (id, flightData) => {
    try {
      const response = await api.put(ENDPOINT, id, flightData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar vuelo
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default flightsService;
