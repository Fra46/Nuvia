# ⚡ Axios Integration Setup - Nuvia

## Resumen

Se ha completado la integración de **Axios** con el frontend React para conectarse al backend ASP.NET Core.

## 📁 Archivos Creados

### Configuración Base
- **`src/api/axiosConfig.js`** - Instancia de Axios con interceptores JWT
- **`src/services/api.js`** - Cliente HTTP genérico con métodos reutilizables
- **`.env.local`** - Variables de entorno (URL del backend)
- **`.env.example`** - Plantilla de configuración

### Servicios (CRUD)
- **`src/services/authService.js`** - Registro, login, logout, magic links
- **`src/services/flightsService.js`** - Gestión de vuelos
- **`src/services/hotelsService.js`** - Gestión de hoteles
- **`src/services/toursService.js`** - Gestión de tours
- **`src/services/packagesService.js`** - Gestión de paquetes
- **`src/services/cartsService.js`** - Gestión de carrito (+ método summary)
- **`src/services/bookingsService.js`** - Gestión de reservas
- **`src/services/paymentsService.js`** - Gestión de pagos (+ checkout session)
- **`src/services/usersService.js`** - Gestión de usuarios

### Documentación
- **`AXIOS_GUIDE.md`** - Guía completa con ejemplos
- **`README_AXIOS.md`** - Este archivo

## 🚀 Quick Start

### 1. Instalar dependencias (si es necesario)
```bash
cd Nuvia.Frontend
npm install
```

### 2. Verificar configuración
Asegúrate de que `.env.local` contiene:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 4. Probar conexión
- Abre el navegador en `http://localhost:5173`
- Haz clic en el botón "Probar Conexión" en la navbar
- Deberías ver un mensaje de éxito si el backend está corriendo

## 💡 Uso Básico

### Importar y usar un servicio
```javascript
import flightsService from '@/services/flightsService';

// Obtener todos
const flights = await flightsService.getAll();

// Obtener por ID
const flight = await flightsService.getById(1);

// Crear
const newFlight = await flightsService.create({ /* datos */ });

// Actualizar
const updated = await flightsService.update(1, { /* datos */ });

// Eliminar
await flightsService.delete(1);
```

### En un componente React
```javascript
import { useState, useEffect } from 'react';
import flightsService from '@/services/flightsService';

function FlightsList() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        const data = await flightsService.getAll();
        setFlights(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <ul>
      {flights.map(f => (
        <li key={f.id}>{f.origin} → {f.destination}</li>
      ))}
    </ul>
  );
}
```

## 🔐 Autenticación

El token JWT se maneja automáticamente:

```javascript
import authService from '@/services/authService';

// Login
const response = await authService.login({ email, password });
// El token se guarda en localStorage automáticamente

// Verificar si está autenticado
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Logout
authService.logout();
```

## ⚙️ Características Avanzadas

### Interceptores
- **Request**: Agrega token JWT automáticamente
- **Response**: Maneja 401 (token expirado) y redirige a login

### Manejo de Errores
Todos los servicios normalizan errores:
```javascript
{
  status: 401,
  message: 'Unauthorized',
  data: { /* respuesta del servidor */ }
}
```

### Variables de Entorno
Puedes definir múltiples entornos:
```
.env.local (desarrollo)
.env.production (producción)
```

## 🔧 Configuración del Backend

Asegúrate de que tu backend (ASP.NET Core) tiene CORS habilitado:

```csharp
// En Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

app.UseCors("AllowReactApp");
```

## 📋 Endpoints Esperados

El backend debe tener los siguientes endpoints:

```
GET/POST    /api/flights
GET/PUT/DELETE /api/flights/{id}

GET/POST    /api/hotels
GET/PUT/DELETE /api/hotels/{id}

GET/POST    /api/tours
GET/PUT/DELETE /api/tours/{id}

GET/POST    /api/packages
GET/PUT/DELETE /api/packages/{id}

GET/POST    /api/carts
GET/PUT/DELETE /api/carts/{id}

GET/POST    /api/bookings
GET/PUT/DELETE /api/bookings/{id}

GET/POST    /api/payments
GET/PUT/DELETE /api/payments/{id}
POST        /api/payments/checkout-session

GET/POST    /api/users
GET/PUT/DELETE /api/users/{id}

POST        /api/auth/login
POST        /api/auth/register
POST        /api/auth/magic-link
POST        /api/auth/magic-link/confirm
```

## 🐛 Troubleshooting

### Error: CORS
→ Verifica que el backend tenga CORS habilitado

### Error: 401 Unauthorized
→ El token ha expirado, se redirige automáticamente a login

### Error: Network Error
→ Verifica que:
- Backend está corriendo en `http://localhost:5000`
- Configuración de `VITE_API_URL` es correcta
- No hay bloques de firewall

### Error: "Cannot find module"
→ Asegúrate de usar la ruta correcta: `@/services/...`

## 📚 Más Información

Ver **`AXIOS_GUIDE.md`** para documentación completa con ejemplos detallados.

## ✅ Checklist de Implementación

- [x] Instancia de Axios configurada
- [x] Interceptores JWT implementados
- [x] Servicios para todas las entidades
- [x] Manejo de errores estandarizado
- [x] Variables de entorno configuradas
- [x] Documentación completa
- [ ] Backend con CORS habilitado (tarea del backend)
- [ ] Probar conexión desde el navegador
- [ ] Implementar componentes de UI

---

**Última actualización:** 2025-06-20
