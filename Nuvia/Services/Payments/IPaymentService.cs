using Nuvia.DTOs;

namespace Nuvia.Services.Payments
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentDTO>> GetAllAsync();
        Task<PaymentDTO?> GetByIdAsync(int id);
        Task<IEnumerable<PaymentDTO>> GetForUserAsync(int userId);
        Task<PaymentDTO?> GetForUserByIdAsync(int userId, int paymentId);

        Task<PaymentDTO?> GetPendingForBookingAsync(int bookingId);

        Task<PaymentDTO> CreatePendingAsync(int userId, int bookingId, decimal amount);

        Task<bool> MarkAsApprovedAsync(int paymentId, string? stripeIntentId = null, string? stripeSessionId = null);
        Task<bool> MarkAsRejectedAsync(int paymentId);
    }
}
