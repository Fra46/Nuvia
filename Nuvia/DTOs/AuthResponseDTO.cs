namespace Nuvia.DTOs
{
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }

        public UserDTO User { get; set; } = null!;
    }
}
