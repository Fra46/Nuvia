namespace Nuvia.Exceptions
{
    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message, string? code = null)
            : base(message, StatusCodes.Status403Forbidden, code ?? "forbidden")
        {
        }
    }
}
