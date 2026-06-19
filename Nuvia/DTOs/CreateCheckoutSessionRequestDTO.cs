using System.ComponentModel.DataAnnotations;

namespace Nuvia.DTOs
{
    public class CreateCheckoutSessionRequestDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "BookingId debe ser mayor que cero.")]
        public int BookingId { get; set; }
    }
}
