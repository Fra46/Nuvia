using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nuvia.Data;
using Nuvia.Models;
using Nuvia.Services;
using Nuvia.Services.Payments;
using Nuvia.Settings;
using Nuvia.Stripe;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Threading.Tasks;
using Event = Stripe.Event;

namespace Nuvia.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/webhooks/stripe")]
    [AllowAnonymous]
    public class StripeWebhookController : ControllerBase
    {
        private readonly NuviaDbContext _context;
        private readonly ILogger<StripeWebhookController> _logger;
        private readonly IEmailSender _emailSender;
        private readonly StripeSettings _stripeSettings;
        private readonly IPaymentService _paymentService;

        public StripeWebhookController(
            NuviaDbContext context,
            ILogger<StripeWebhookController> logger,
            IEmailSender emailSender,
            IOptions<StripeSettings> stripeSettings,
            IPaymentService paymentService)
        {
            _context = context;
            _logger = logger;
            _emailSender = emailSender;
            _stripeSettings = stripeSettings.Value;
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> Handle()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            Event stripeEvent;
            try
            {
                if (string.IsNullOrWhiteSpace(json))
                {
                    _logger.LogWarning("Webhook stripe recibido con body vacío.");
                    return Ok();
                }

                // Intentar validar con firma si el webhook secret está configurado
                var sigHeader = HttpContext.Request.Headers["Stripe-Signature"].FirstOrDefault();

                if (!string.IsNullOrEmpty(sigHeader) && !string.IsNullOrEmpty(_stripeSettings?.WebhookSecret))
                {
                    try
                    {
                        stripeEvent = EventUtility.ConstructEvent(
                            json,
                            sigHeader,
                            _stripeSettings.WebhookSecret,
                            throwOnApiVersionMismatch: false);

                        _logger.LogInformation("Webhook de Stripe validado correctamente con firma.");
                    }
                    catch (StripeException ex)
                    {
                        _logger.LogError(ex, "Firma del webhook de Stripe inválida. Rechazando solicitud.");
                        return Unauthorized(new { error = "Webhook signature verification failed" });
                    }
                }
                else
                {
                    // Fallback: parseo sin validación (desarrollo local)
                    _logger.LogWarning("Validando webhook sin firma (modo desarrollo). Mismatch de versión API puede ocurrir.");
                    stripeEvent = EventUtility.ParseEvent(json, throwOnApiVersionMismatch: false);
                }

                if (stripeEvent == null)
                {
                    _logger.LogWarning("EventUtility devolvió null para el body recibido.");
                    return Ok();
                }
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "No se pudo parsear el evento de Stripe.");
                return Ok();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error procesando el body del webhook de Stripe.");
                return Ok();
            }

            _logger.LogInformation("Stripe webhook recibido: {Type}", stripeEvent.Type);

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;
                if (session == null)
                {
                    _logger.LogWarning("Session null en checkout.session.completed");
                    return Ok();
                }

                await HandleCheckoutSessionCompletedAsync(session);
            }

            return Ok();
        }

        private async Task HandleCheckoutSessionCompletedAsync(Session session)
        {
            _logger.LogInformation("Procesando checkout.session.completed. SessionId: {SessionId}", session.Id);

            try
            {
                if (session.PaymentIntentId == null)
                {
                    _logger.LogWarning("Session {SessionId} no tiene PaymentIntentId.", session.Id);
                    return;
                }

                // 1) Sacar paymentId y bookingId del metadata
                if (!session.Metadata.TryGetValue("paymentId", out var paymentIdStr) ||
                    !int.TryParse(paymentIdStr, out var paymentId))
                {
                    _logger.LogWarning("Session {SessionId} sin paymentId válido en metadata.", session.Id);
                    return;
                }

                if (!session.Metadata.TryGetValue("bookingId", out var bookingIdStr) ||
                    !int.TryParse(bookingIdStr, out var bookingId))
                {
                    _logger.LogWarning("Session {SessionId} sin bookingId válido en metadata.", session.Id);
                    return;
                }

                var approved = await _paymentService.MarkAsApprovedAsync(
                    paymentId,
                    stripeIntentId: session.PaymentIntentId,
                    stripeSessionId: session.Id);

                if (!approved)
                {
                    _logger.LogWarning(
                        "No se pudo aprobar el payment {PaymentId} asociado a la sesión {SessionId}.",
                        paymentId,
                        session.Id);
                    return;
                }

                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                    .FirstOrDefaultAsync(p => p.Id == paymentId && p.BookingId == bookingId);

                if (payment == null)
                {
                    _logger.LogWarning(
                        "No se encontró Payment con Id={PaymentId} y BookingId={BookingId} tras aprobarlo.",
                        paymentId,
                        bookingId);
                    return;
                }

                _logger.LogInformation(
                    "Payment {PaymentId} aprobado y Booking #{BookingId} confirmada.",
                    payment.Id,
                    payment.BookingId);

                var booking = payment.Booking;
                var user = booking?.User;

                if (booking != null && user != null)
                {
                    await _emailSender.SendPaymentReceiptAsync(
                        user.Email,
                        user.FullName ?? user.Email,
                        booking.BookingCode,
                        payment.Id,
                        payment.Amount,
                        DateTime.UtcNow);
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error procesando checkout.session.completed para SessionId {SessionId}", session.Id);
            }
        }
    }
}
