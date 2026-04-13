namespace Nuvia.DTOs
{
    public class PackageUpdateDTO
    {
        public string Title { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public string? Description { get; set; }

        public int Nights { get; set; }
        public decimal TotalPrice { get; set; }

        public bool IsActive { get; set; }
    }
}
