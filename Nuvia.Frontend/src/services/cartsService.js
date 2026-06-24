import api from './api';

const ENDPOINT = '/carts';

/**
 * Servicio para gestionar carros de compra
 */
const cartsService = {
  // Obtener todos los carros
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener carro por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo carro
  create: async (cartData) => {
    try {
      const response = await api.post(ENDPOINT, cartData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar carro
  update: async (id, cartData) => {
    try {
      const response = await api.put(ENDPOINT, id, cartData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar carro
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener resumen del carro
  getSummary: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}/summary`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default cartsService;
