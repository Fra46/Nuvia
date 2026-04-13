using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Exceptions;
using Nuvia.Models;
using Nuvia.Stripe;
using Stripe.Checkout;

namespace Nuvia.Services.Payments
{
    public class PaymentStripeService
    {
        private readonly StripeSettings _stripeSettings;
        private readonly NuviaDbContext _context;
        private readonly IPaymentService _paymentService;

        public PaymentStripeService(
            StripeSettings stripeSettings,
            NuviaDbContext context,
            IPaymentService paymentService)
        {
            _stripeSettings = stripeSettings;
            _context = context;
            _paymentService = paymentService;
        }

        public async Task<(string url, int paymentId)> CreateCheckoutSessionAsync(int userId, int bookingId)
        {
            var booking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                throw new NotFoundException($"La reserva {bookingId} no existe.");

            if (booking.UserId != userId)
                throw new ForbiddenException("No puedes pagar una reserva que no es tuya.");

            if (booking.TotalPrice <= 0)
                throw new ValidationException(
                    "La reserva no tiene un total válido para pagar.",
                    new Dictionary<string, string[]>
                    {
                        ["totalPrice"] = new[] { "El total debe ser mayor que cero." }
                    });

            // Creamos el payment pendiente usando tu servicio
            var paymentDto = await _paymentService.CreatePendingAsync(
                userId,
                bookingId,
                booking.TotalPrice
            );

            var domain = "http://localhost:5173";

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },

                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "cop",
                            UnitAmount = (long)(booking.TotalPrice * 100m),

                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Reserva #{booking.Id}"
                            }
                        }
                    }
                },

                Mode = "payment",

                SuccessUrl = $"{domain}/payment-success?paymentId={paymentDto.Id}",
                CancelUrl = $"{domain}/payment-cancel",

                // 👇👇 ¡CLAVE! Aquí mandamos los IDs que el webhook va a leer 👇👇
                Metadata = new Dictionary<string, string>
                {
                    ["paymentId"] = paymentDto.Id.ToString(),
                    ["bookingId"] = booking.Id.ToString()
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            var payment = await _context.Payments.FindAsync(paymentDto.Id);
            if (payment != null)
            {
                payment.StripeSessionId = session.Id;
                await _context.SaveChangesAsync();
            }

            return (session.Url!, paymentDto.Id);
        }
    }
}
