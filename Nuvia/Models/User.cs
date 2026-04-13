namespace Nuvia.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        public UserRole Role { get; set; } = UserRole.Customer;
        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; } = true;
        public bool EmailVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public string? MagicLinkToken { get; set; }
        public DateTime? MagicLinkExpiresAt { get; set; }

        // Navegación
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
    }
}
