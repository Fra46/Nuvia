using Microsoft.AspNetCore.Http;

namespace Nuvia.Exceptions
{
    public class TokenExpiredException : AppException
    {
        public TokenExpiredException()
            : base(
                "Tu sesión ha expirado. Inicia sesión nuevamente.",
                StatusCodes.Status401Unauthorized,
                "token_expired")
        {
        }
    }
}
