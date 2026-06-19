# Configuración del Proyecto Nuvia

## 1. Secretos en Desarrollo (User Secrets)

Para evitar comprometer claves sensibles en repositorios, usa **User Secrets** durante el desarrollo.

### Inicializar User Secrets (primera vez)

En la carpeta `Nuvia/Nuvia`, ejecuta:

```powershell
dotnet user-secrets init
```

Esto genera un archivo de secretos local en tu máquina (`%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>`).

### Agregar Secretos

Para cada valor sensible, usa:

```powershell
dotnet user-secrets set "JwtSettings:Key" "Nuvi@_System_T@urism_M@nagement_2025"
dotnet user-secrets set "Stripe:SecretKey" "sk_test_51S3roVRqVbXrHPfHms6HAc2mDRAoKgBxXoyvHYU1FnjwW08PXJcSmubWJVPbCvk4sMGdL7znjrf87h0XcvAsHJRK00khzI61lH"
dotnet user-secrets set "Stripe:PublishableKey" "pk_test_51S3roVRqVbXrHPfHmBLI5my2SCWkEsBeqkdU1qcdT56FGD0f52H0nBBAOWpufiyHA2XRlYtz60C3fq1wMLRICa7d00ttmVysep"
dotnet user-secrets set "Stripe:WebhookSecret" "whsec_889792f8e87037106eb9cc8aeced44b11e1659b8d978f53106ec1eb624521c61"
dotnet user-secrets set "Smtp:User" "andresfzapatamar@gmail.com"
dotnet user-secrets set "Smtp:Password" "ulrx xzdk zyqz kzad"
```

### Listar Secretos Configurados

```powershell
dotnet user-secrets list
```

### Borrar un Secreto

```powershell
dotnet user-secrets remove "Stripe:SecretKey"
```

---

## 2. Variables de Entorno (Producción/Contenedores)

En producción, los secretos se pasan como **variables de entorno**. ASP.NET Core las lee automáticamente y reemplaza los valores de `appsettings.json`.

### Formato de Variable de Entorno

Las variables usan dos puntos `:` como separadores. Ejemplo:

```bash
# Linux/macOS
export JwtSettings__Key="tu-clave-jwt"
export Stripe__SecretKey="sk_test_..."

# Windows PowerShell
$env:JwtSettings__Key="tu-clave-jwt"
$env:Stripe__SecretKey="sk_test_..."
```

**Nota**: En Windows y archivos `.env`, usa `__` (doble guión bajo) en lugar de `:` (dos puntos).

### Archivos `.env` (Docker/Compose)

Si usas Docker Compose, crea `.env` en la raíz del proyecto:

```ini
# .env (NO COMMITEAR A GIT - agregar a .gitignore)
JwtSettings__Key=Nuvi@_System_T@urism_M@nagement_2025
Stripe__SecretKey=sk_test_...
Stripe__PublishableKey=pk_test_...
Stripe__WebhookSecret=whsec_...
Smtp__User=tu@email.com
Smtp__Password=tu_password
FrontendUrl=https://tu-dominio-frontend.com
```

---

## 3. Claves Sensibles en el Proyecto

Las siguientes claves están configuradas en `appsettings.json` y **deben** ser secretos en producción:

| Clave | Descripción | Valor por Defecto |
|-------|-------------|-------------------|
| `JwtSettings:Key` | Clave para firmar JWT | (en appsettings.json) |
| `Stripe:SecretKey` | Clave privada de Stripe | (en appsettings.json) |
| `Stripe:PublishableKey` | Clave pública de Stripe | (en appsettings.json) |
| `Stripe:WebhookSecret` | Token para validar webhooks de Stripe | (en appsettings.json) |
| `Smtp:User` | Email de GMail | (en appsettings.json) |
| `Smtp:Password` | Contraseña de aplicación de GMail | (en appsettings.json) |

---

## 4. Para los Compañeros (sin User Secrets Configurados)

Si un compañero clona el proyecto sin user secrets:

### Opción A: Usar User Secrets (Recomendado para Desarrollo)

```powershell
# Dentro de Nuvia/Nuvia
dotnet user-secrets init
dotnet user-secrets set "JwtSettings:Key" "Nuvi@_System_T@urism_M@nagement_2025"
# ... agregar el resto de secretos
```

### Opción B: Editar appsettings.json Localmente (NO RECOMENDADO)

1. Los valores están ya en `appsettings.json` como fallback.
2. Cambiar los valores en `appsettings.json` NO afecta al repositorio si tienes un `.gitignore` bien configurado.
3. **PERO**: Si commiteás por accidente, los secretos quedan expuestos en el histórico de Git.

### Opción C: Crear `appsettings.Development.json` (Alternativa)

Cada compañero puede crear `Nuvia/Nuvia/appsettings.Development.json` con sus valores locales:

```json
{
  "JwtSettings": {
    "Key": "Nuvi@_System_T@urism_M@nagement_2025"
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  },
  "Smtp": {
    "User": "tu@email.com",
    "Password": "tu_password"
  }
}
```

**Importante**: Agregar `appsettings.Development.json` a `.gitignore` para que NO se comitee:

```gitignore
appsettings.Development.json
appsettings.*.json
.env
```

---

## 5. Flujo de Configuración en Tiempo de Ejecución

ASP.NET Core carga configuración en este orden (última gana):

1. `appsettings.json`
2. `appsettings.{Environment}.json` (si existe)
3. User Secrets (si está en desarrollo)
4. Variables de entorno
5. Command-line arguments

**Implicación**: Si configuras un secret en User Secrets, reemplaza automáticamente el valor de `appsettings.json`.

---

## 6. Checklist de Configuración

- [ ] Archivo `.gitignore` incluye `appsettings.Development.json`
- [ ] Archivo `.gitignore` incluye `appsettings.*.json`
- [ ] Archivo `.gitignore` incluye `.env`
- [ ] Cada desarrollador ejecutó `dotnet user-secrets init`
- [ ] Cada desarrollador agregó los secretos con `dotnet user-secrets set`
- [ ] En producción, las variables de entorno se cargan desde sistema operativo o plataforma (Azure, Docker, etc.)
- [ ] Webhook de Stripe usa `WebhookSecret` para validar firma (implementado en `StripeWebhookController.cs`)
- [ ] URL del frontend es configurable con `FrontendUrl` en `appsettings.json` o variable de entorno

---

## 7. Referencias

- [Microsoft - User Secrets](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [ASP.NET Core Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration)
- [Stripe - Webhook Signature Verification](https://stripe.com/docs/webhooks/signatures)
