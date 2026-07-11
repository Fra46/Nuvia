using System.ComponentModel.DataAnnotations.Schema;

namespace Nuvia.Models
{
    public class TourPricing
    {
        public int Id { get; set; }

        public int TourId { get; set; }
        public Tour? Tour { get; set; }

        public int MinPeople { get; set; }
        public int MaxPeople { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
