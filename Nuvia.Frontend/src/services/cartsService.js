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

  // OJO: la URL ya viene completa (incluye el itemId), por eso usamos putFull
  // en vez de put (que agregaría un segundo id y dejaría el body vacío).
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.putFull(`${ENDPOINT}/update/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Igual aquí: usamos deleteFull porque la URL ya incluye el itemId.
  removeItem: async (itemId) => {
    try {
      const response = await api.deleteFull(`${ENDPOINT}/remove/${itemId}`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  clear: async () => {
    try {
      const response = await api.deleteFull(`${ENDPOINT}/clear`);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default cartsService;
