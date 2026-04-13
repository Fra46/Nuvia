using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Nuvia.Exceptions;

namespace Nuvia.Middleware
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TokenValidationMiddleware> _logger;

        public TokenValidationMiddleware(
            RequestDelegate next,
            ILogger<TokenValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(authHeader) &&
                authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader["Bearer ".Length..].Trim();

                try
                {
                    var handler = new JwtSecurityTokenHandler();

                    if (handler.CanReadToken(token))
                    {
                        var jwt = handler.ReadJwtToken(token);

                        // ValidTo ya viene en UTC desde el "exp"
                        var exp = jwt.ValidTo;

                        if (exp < DateTime.UtcNow)
                        {
                            _logger.LogInformation(
                                "Token expirado para la ruta {Path}",
                                context.Request.Path
                            );

                            // Esta excepción será manejada por ErrorHandlingMiddleware
                            throw new TokenExpiredException();
                        }
                    }
                }
                catch (SecurityTokenException ex)
                {
                    _logger.LogWarning(ex, "Error leyendo el token JWT.");
                    // Dejamos que el esquema de autenticación normal maneje tokens corruptos
                }
                catch (ArgumentException ex)
                {
                    _logger.LogWarning(ex, "Token JWT inválido en la cabecera Authorization.");
                }
            }

            await _next(context);
        }
    }
}
