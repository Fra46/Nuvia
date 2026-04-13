namespace Nuvia.Exceptions
{
    public class NotFoundException : AppException
    {
        public NotFoundException(string message, string? code = null)
            : base(message, StatusCodes.Status404NotFound, code ?? "not_found")
        {
        }
    }
}