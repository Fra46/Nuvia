import api from './api';

const ENDPOINT = '/bookings';

/**
 * Servicio para gestionar reservas
 */
const bookingsService = {
  // Obtener todas las reservas
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener reserva por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nueva reserva
  create: async (bookingData) => {
    try {
      const response = await api.post(ENDPOINT, bookingData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar reserva
  update: async (id, bookingData) => {
    try {
      const response = await api.put(ENDPOINT, id, bookingData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar reserva
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default bookingsService;
