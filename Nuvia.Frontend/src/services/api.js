import apiClient from '../api/axiosConfig';

/**
 * Cliente HTTP genérico para hacer peticiones al backend
 */
const api = {
  // Métodos GET
  get: (endpoint, config = {}) => apiClient.get(endpoint, config),
  getById: (endpoint, id, config = {}) => apiClient.get(`${endpoint}/${id}`, config),

  // Métodos POST
  post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),

  // Métodos PUT
  put: (endpoint, id, data, config = {}) => apiClient.put(`${endpoint}/${id}`, data, config),
  putFull: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),

  // Métodos DELETE
  delete: (endpoint, id, config = {}) => apiClient.delete(`${endpoint}/${id}`, config),
  deleteFull: (endpoint, config = {}) => apiClient.delete(endpoint, config),

  // Métodos PATCH
  patch: (endpoint, id, data, config = {}) => apiClient.patch(`${endpoint}/${id}`, data, config),

  // Manejo de errores personalizado
  handleError: (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Error en la solicitud',
        data: error.response.data,
      };
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      return {
        status: 0,
        message: 'No hay respuesta del servidor',
      };
    } else {
      // Error en la configuración de la solicitud
      return {
        status: 0,
        message: error.message,
      };
    }
  },
};

export default api;
