namespace Nuvia.Exceptions
{
    public abstract class AppException : Exception
    {
        public int StatusCode { get; }
        public string? Code { get; }

        protected AppException(string message, int statusCode, string? code = null)
            : base(message)
        {
            StatusCode = statusCode;
            Code = code;
        }
    }
}
