import axios from 'axios';

// Obtener la URL base del backend desde variables de entorno o usar una predeterminada
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7299/api';

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    try {
      console.debug('[axiosConfig] request to', config.url, 'token present?', !!token);
    } catch (ex) {
      // ignore
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        console.debug('[axiosConfig] set Authorization header for', config.url);
      } catch (ex) {}
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const requestUrl = error?.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/');

      // Log para depuración: mostrar cuándo ocurre un 401 y la URL afectada
      if (error.response?.status === 401) {
        console.debug('[axiosConfig] 401 recibido en:', requestUrl, 'isAuthRequest=', isAuthRequest, 'status=', error.response.status);
      }

      // Evitar cerrar la sesión ante una respuesta 401 inesperada en la carga del perfil,
      // y dejar que la página maneje el error de forma local.
      if (error.response?.status === 401 && !isAuthRequest) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        console.debug('[axiosConfig] token presente en localStorage?', !!token, 'user?', !!user);

        if (token && user) {
          // Notificar al contexto para sincronizar estado sin borrar datos.
          window.dispatchEvent(new Event('auth:changed'));
        }
      }
    } catch (ex) {
      console.error('[axiosConfig] error en interceptor response:', ex);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
