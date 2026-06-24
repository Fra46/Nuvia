import api from './api';

const ENDPOINT = '/packages';

/**
 * Servicio para gestionar paquetes
 */
const packagesService = {
  // Obtener todos los paquetes
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Obtener paquete por ID
  getById: async (id) => {
    try {
      const response = await api.getById(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Crear nuevo paquete
  create: async (packageData) => {
    try {
      const response = await api.post(ENDPOINT, packageData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Actualizar paquete
  update: async (id, packageData) => {
    try {
      const response = await api.put(ENDPOINT, id, packageData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },

  // Eliminar paquete
  delete: async (id) => {
    try {
      const response = await api.delete(ENDPOINT, id);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
};

export default packagesService;
