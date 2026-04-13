using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class PaymentUpdateDTO
    {
        public PaymentStatus Status { get; set; }

        public string? StripePaymentIntentId { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripeCustomerId { get; set; }
    }
}
