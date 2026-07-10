import api from './api';

const ENDPOINT = '/payments';

/**
 * Servicio para gestionar pagos (Stripe)
 * Refleja exactamente los endpoints expuestos por PaymentsController:
 *   GET  /payments            (admin/agent)
 *   GET  /payments/{id}       (admin/agent)
 *   GET  /payments/me         (usuario autenticado)
 *   GET  /payments/me/{id}    (usuario autenticado)
 *   POST /payments/create-checkout-session (usuario autenticado)
 */
const paymentsService = {
  // Admin/Agent: todos los pagos
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Admin/Agent: un pago por id
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Usuario autenticado: todos mis pagos
  getMyPayments: async () => {
    try {
      const response = await api.get(`${ENDPOINT}/me`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Usuario autenticado: uno de mis pagos por id
  getMyPayment: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}/me/${id}`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crea la sesión de checkout de Stripe para una reserva (booking) ya creada.
  // Devuelve { paymentId, url } -> hay que redirigir el navegador a `url`.
  createCheckoutSession: async (bookingId) => {
    try {
      const response = await api.post(`${ENDPOINT}/create-checkout-session`, { bookingId });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default paymentsService;
