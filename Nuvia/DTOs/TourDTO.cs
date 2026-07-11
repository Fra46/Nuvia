namespace Nuvia.DTOs
{
    public class TourDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;

        public string? Description { get; set; }
        public int DurationHours { get; set; }
        public decimal PricePerPerson { get; set; }
        public int AvailableSlots { get; set; }

        public IEnumerable<TourPricingDTO>? Rates { get; set; }

        public bool IsActive { get; set; }
    }
}
