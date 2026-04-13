namespace Nuvia.Models
{
    public class Package
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public string? Description { get; set; }

        public int Nights { get; set; }
        public decimal TotalPrice { get; set; }

        public bool IsActive { get; set; } = true;

        // Navegación
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
    }
}
