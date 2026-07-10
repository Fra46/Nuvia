import api from './api';

const ENDPOINT = '/bookings';

const bookingsService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT, id, data);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crea una reserva (Booking) a partir del carrito del usuario autenticado.
  // Backend: POST /api/bookings/checkout-from-cart -> BookingDTO
  checkoutFromCart: async () => {
    try {
      const response = await api.post(`${ENDPOINT}/checkout-from-cart`, {});
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default bookingsService;
