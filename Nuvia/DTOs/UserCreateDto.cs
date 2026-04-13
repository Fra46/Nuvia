using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class UserCreateDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public UserRole Role { get; set; } = UserRole.Customer;
        public string? PhoneNumber { get; set; }
    }
}
