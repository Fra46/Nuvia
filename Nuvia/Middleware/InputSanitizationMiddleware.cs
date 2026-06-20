using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Nuvia.Middleware
{
    public class InputSanitizationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<InputSanitizationMiddleware> _logger;

        public InputSanitizationMiddleware(RequestDelegate next, ILogger<InputSanitizationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Log incoming requests for POST/PUT (potential user input)
            if (context.Request.Method == HttpMethods.Post || context.Request.Method == HttpMethods.Put)
            {
                _logger.LogDebug("Input validation será aplicada por DTOs con atributos [Required], [StringLength], etc. en {Path}", 
                    context.Request.Path);
                
                // Aquí se pueden agregar más validaciones personalizadas si es necesario
                // La sanitización principal ocurre a través de validación en DTOs
            }

            await _next(context);
        }
    }
}
