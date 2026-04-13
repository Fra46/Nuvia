using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class PaymentCreateDTO
    {
        public int BookingId { get; set; }
        public decimal Amount { get; set; }

        public PaymentMethod Method { get; set; } = PaymentMethod.Stripe;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? StripePaymentIntentId { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripeCustomerId { get; set; }
    }
}
