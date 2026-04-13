namespace Nuvia.DTOs
{
    public class PackageDTO
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public string? Description { get; set; }

        public int Nights { get; set; }
        public decimal TotalPrice { get; set; }

        public bool IsActive { get; set; }
    }
}
