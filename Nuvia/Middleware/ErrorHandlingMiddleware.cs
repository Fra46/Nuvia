using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;
using Nuvia.Exceptions;

namespace Nuvia.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlingMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error global capturado por el middleware");
                await WriteErrorResponseAsync(context, ex);
            }
        }

        private Task WriteErrorResponseAsync(HttpContext context, Exception ex)
        {
            context.Response.Clear();
            int statusCode;
            string code;
            string message;
            object? extra = null;

            switch (ex)
            {
                case ValidationException vex:
                    statusCode = vex.StatusCode;
                    code = vex.Code ?? "validation_error";
                    message = vex.Message;
                    extra = new { errors = vex.Errors };
                    break;

                case SecurityTokenExpiredException:
                    statusCode = StatusCodes.Status401Unauthorized;
                    code = "token_expired";
                    message = "Tu sesión ha expirado. Inicia sesión nuevamente.";
                    break;

                case ArgumentException aex:
                    statusCode = StatusCodes.Status400BadRequest;
                    code = "invalid_argument";
                    message = aex.Message;
                    break;

                case NotFoundException nfex:
                    statusCode = nfex.StatusCode;
                    code = nfex.Code ?? "not_found";
                    message = nfex.Message;
                    break;

                case ForbiddenException fex:
                    statusCode = fex.StatusCode;
                    code = fex.Code ?? "forbidden";
                    message = fex.Message;
                    break;

                case AppException aex:
                    statusCode = aex.StatusCode;
                    code = aex.Code ?? "app_error";
                    message = aex.Message;
                    break;

                case UnauthorizedAccessException:
                    statusCode = StatusCodes.Status401Unauthorized;
                    code = "unauthorized";
                    message = "No estás autorizado para realizar esta acción.";
                    break;

                case OperationCanceledException:
                    statusCode = StatusCodes.Status503ServiceUnavailable;
                    code = "request_canceled";
                    message = "La solicitud fue cancelada o el servidor no pudo procesarla a tiempo.";
                    break;

                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    code = "server_error";
                    message = "Ocurrió un error inesperado en el servidor.";
                    break;
            }

            var responseObj = new
            {
                status = statusCode,
                code,
                error = message,
                detail = _env.IsDevelopment() ? ex.ToString() : null,
                extra
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(responseObj,
                new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });

            return context.Response.WriteAsync(json);
        }
    }
}
