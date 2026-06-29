import api from './api';

const ENDPOINT = '/carts';

/**
 * Servicio para gestionar el carrito de compras
 */
const cartsService = {
  getMyCart: async () => {
    try {
      const response = await api.get(`${ENDPOINT}/me`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  getSummary: async () => {
    try {
      const response = await api.get(`${ENDPOINT}/summary`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  addItem: async (itemData) => {
    try {
      const response = await api.post(`${ENDPOINT}/add`, itemData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`${ENDPOINT}/update/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`${ENDPOINT}/remove/${itemId}`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  clear: async () => {
    try {
      const response = await api.delete(`${ENDPOINT}/clear`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default cartsService;
