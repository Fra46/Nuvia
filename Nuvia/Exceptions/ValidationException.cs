namespace Nuvia.Exceptions
{
    public class ValidationException : AppException
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException(
            string message,
            IDictionary<string, string[]> errors,
            string? code = null)
            : base(message, StatusCodes.Status400BadRequest, code ?? "validation_error")
        {
            Errors = errors;
        }
    }
}
