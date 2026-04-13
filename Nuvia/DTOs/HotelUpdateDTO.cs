namespace Nuvia.DTOs
{
    public class HotelUpdateDTO
    {
        public string Name { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string? Address { get; set; }

        public int Stars { get; set; }
        public decimal PricePerNight { get; set; }

        public bool IsActive { get; set; }
    }
}
