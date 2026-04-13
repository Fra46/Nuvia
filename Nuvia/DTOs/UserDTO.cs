using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        public UserRole Role { get; set; }
        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; }
        public bool EmailVerified { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}
