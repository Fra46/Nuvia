import api from './api';

const ENDPOINT = '/payments';

/**
 * Servicio para gestionar pagos
 */
const paymentsService = {
  // Obtener todos los pagos
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener pago por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo pago
  create: async (paymentData) => {
    try {
      const response = await api.post(ENDPOINT, paymentData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar pago
  update: async (id, paymentData) => {
    try {
      const response = await api.put(ENDPOINT, id, paymentData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar pago
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear sesión de checkout (Stripe)
  createCheckoutSession: async (sessionData) => {
    try {
      const response = await api.post(`${ENDPOINT}/checkout-session`, sessionData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default paymentsService;
