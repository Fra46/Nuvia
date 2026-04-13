using System.Net;
using System.Text.Json;
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
                    statusCode = (int)HttpStatusCode.Unauthorized;
                    code = "unauthorized";
                    message = "No estás autorizado para realizar esta acción.";
                    break;

                default:
                    statusCode = (int)HttpStatusCode.InternalServerError;
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
                new JsonSerializerOptions { IgnoreNullValues = true });

            return context.Response.WriteAsync(json);
        }
    }
}
