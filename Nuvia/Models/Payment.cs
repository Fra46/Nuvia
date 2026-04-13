namespace Nuvia.Models
{
    public enum PaymentStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3
    }

    public enum PaymentMethod
    {
        Simulated = 1,
        Stripe = 2
    }

    public class Payment
    {
        public int Id { get; set; }

        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;

        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; } = PaymentMethod.Stripe;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? StripePaymentIntentId { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripeCustomerId { get; set; }
    }
}
