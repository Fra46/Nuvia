# Guía de Integración con Axios

## Descripción General

Se ha configurado una integración completa con Axios para conectar el frontend React con el backend ASP.NET Core. La arquitectura incluye interceptores, manejo de errores y servicios especializados para cada entidad del sistema.

## Estructura de Carpetas

```
src/
├── api/
│   └── axiosConfig.js       # Configuración central de Axios
├── services/
│   ├── api.js              # Cliente HTTP genérico
│   ├── authService.js      # Servicio de autenticación
│   ├── flightsService.js   # Servicio de vuelos
│   ├── hotelsService.js    # Servicio de hoteles
│   ├── toursService.js     # Servicio de tours
│   ├── packagesService.js  # Servicio de paquetes
│   ├── cartsService.js     # Servicio de carrito
│   ├── bookingsService.js  # Servicio de reservas
│   ├── paymentsService.js  # Servicio de pagos
│   └── usersService.js     # Servicio de usuarios
```

## Configuración

### Variables de Entorno

El archivo `.env.local` contiene la URL base de la API:

```env
VITE_API_URL=http://localhost:5000/api
```

Puedes cambiar esta URL según tu entorno (desarrollo, producción, etc.).

## Cómo Usar

### 1. Importar un Servicio

```javascript
import flightsService from '@/services/flightsService';
// o
import authService from '@/services/authService';
```

### 2. Llamar Métodos del Servicio

#### Obtener todos los registros

```javascript
const handleGetFlights = async () => {
  try {
    const flights = await flightsService.getAll();
    console.log('Vuelos:', flights);
  } catch (error) {
    console.error('Error al obtener vuelos:', error);
  }
};
```

#### Obtener un registro por ID

```javascript
const handleGetFlight = async (id) => {
  try {
    const flight = await flightsService.getById(id);
    console.log('Vuelo:', flight);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Crear un nuevo registro

```javascript
const handleCreateFlight = async () => {
  const flightData = {
    origin: 'New York',
    destination: 'Los Angeles',
    departureDate: '2024-01-15',
    price: 299.99
  };

  try {
    const newFlight = await flightsService.create(flightData);
    console.log('Vuelo creado:', newFlight);
  } catch (error) {
    console.error('Error al crear vuelo:', error);
  }
};
```

#### Actualizar un registro

```javascript
const handleUpdateFlight = async (id) => {
  const updateData = {
    price: 349.99
  };

  try {
    const updated = await flightsService.update(id, updateData);
    console.log('Vuelo actualizado:', updated);
  } catch (error) {
    console.error('Error al actualizar vuelo:', error);
  }
};
```

#### Eliminar un registro

```javascript
const handleDeleteFlight = async (id) => {
  try {
    const result = await flightsService.delete(id);
    console.log('Vuelo eliminado:', result);
  } catch (error) {
    console.error('Error al eliminar vuelo:', error);
  }
};
```

### 3. Ejemplo de Autenticación

```javascript
import authService from '@/services/authService';

// Login
const handleLogin = async (email, password) => {
  try {
    const response = await authService.login({ email, password });
    console.log('Usuario autenticado:', response);
    // El token se guarda automáticamente en localStorage
  } catch (error) {
    console.error('Error de login:', error);
  }
};

// Registrarse
const handleRegister = async (userData) => {
  try {
    const response = await authService.register(userData);
    console.log('Usuario registrado:', response);
  } catch (error) {
    console.error('Error al registrarse:', error);
  }
};

// Logout
const handleLogout = () => {
  authService.logout();
};

// Verificar autenticación
const isAuthenticated = authService.isAuthenticated();
```

### 4. Uso en Componentes React

```javascript
import React, { useState, useEffect } from 'react';
import flightsService from '@/services/flightsService';

function FlightList() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await flightsService.getAll();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id}>
          <h3>{flight.origin} → {flight.destination}</h3>
          <p>Precio: ${flight.price}</p>
        </div>
      ))}
    </div>
  );
}

export default FlightList;
```

## Características de Axios

### Interceptores Automáticos

#### 1. Interceptor de Solicitud

- Agrega automáticamente el token JWT almacenado en `localStorage` a todas las solicitudes
- Encabezado: `Authorization: Bearer {token}`

#### 2. Interceptor de Respuesta

- Si la respuesta es 401 (No autorizado), limpia el token y redirige a `/login`
- Maneja errores de forma automática

### Manejo de Errores

El servicio `api.js` proporciona un método `handleError()` que normaliza los errores:

```javascript
{
  status: number,        // Código HTTP
  message: string,       // Mensaje de error
  data: object          // Datos de la respuesta del servidor
}
```

## Configuración Adicional

### Cambiar la URL Base del API

Edita el archivo `.env.local`:

```env
VITE_API_URL=https://api.tu-dominio.com/api
```

### Aumentar el Timeout

Edita `src/api/axiosConfig.js`:

```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 segundos en lugar de 10
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Agregar Headers Personalizados

En `src/api/axiosConfig.js`, modifica el interceptor de solicitud:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Custom-Header'] = 'valor-personalizado';
    return config;
  },
  // ...
);
```

## Próximos Pasos

1. **Asegúrate de que el backend está corriendo** en `http://localhost:5000`
2. **Instala Vite** si aún no lo tienes: `npm install`
3. **Inicia el servidor de desarrollo**: `npm run dev`
4. **Prueba los servicios** importándolos en tus componentes

## Solución de Problemas

### Error: CORS

Si recibes errores de CORS, asegúrate de que el backend tiene CORS habilitado. En `Program.cs`, agrega:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowReactApp");
```

### Error: 401 Unauthorized

Esto significa que el token JWT ha expirado. El usuario será redirigido automáticamente a `/login`.

### Error: Network Error

Verifica que:
- El backend está corriendo en `http://localhost:5000`
- La variable de entorno `VITE_API_URL` es correcta
- No hay problemas de red o firewall
