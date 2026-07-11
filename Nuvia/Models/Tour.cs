namespace Nuvia.Models
{
    public class Tour
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;

        public string? Description { get; set; }
        public int DurationHours { get; set; }
        public decimal PricePerPerson { get; set; }
        public int AvailableSlots { get; set; }

        public bool IsActive { get; set; } = true;

        // Navegación
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
        public ICollection<TourPricing> Rates { get; set; } = new List<TourPricing>();
    }
}
