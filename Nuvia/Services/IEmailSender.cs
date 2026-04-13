namespace Nuvia.Services
{
    public interface IEmailSender
    {
        Task SendMagicLinkAsync(string toEmail, string magicLinkUrl, string? userName);

        Task SendBookingConfirmationAsync(
            string toEmail,
            string userName,
            string bookingCode,
            DateTime bookingDate,
            decimal total);

        Task SendPaymentReceiptAsync(
            string toEmail,
            string userName,
            string bookingCode,
            int paymentId,
            decimal amount,
            DateTime paidAt);
    }
}
