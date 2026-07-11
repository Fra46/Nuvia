namespace Nuvia.DTOs
{
    public class TourPricingDTO
    {
        public int Id { get; set; }
        public int MinPeople { get; set; }
        public int MaxPeople { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
