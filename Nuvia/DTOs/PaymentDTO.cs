using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class PaymentDTO
    {
        public int Id { get; set; }

        public int BookingId { get; set; }
        public decimal Amount { get; set; }

        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? StripePaymentIntentId { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripeCustomerId { get; set; }
    }
}
