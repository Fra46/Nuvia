namespace Nuvia.Settings
{
    public class SmtpSettings
    {
        public string Host { get; set; } = null!;
        public int Port { get; set; } = 587;
        public bool EnableSsl { get; set; } = true;
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string From { get; set; } = null!;
    }
}
