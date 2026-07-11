namespace Nuvia.DTOs
{
    public class TourUpdateDTO
    {
        public string Name { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;

        public string? Description { get; set; }
        public int DurationHours { get; set; }
        public decimal PricePerPerson { get; set; }
        public int AvailableSlots { get; set; }

        public bool IsActive { get; set; }
        public IEnumerable<TourPricingDTO>? Rates { get; set; }
    }
}
