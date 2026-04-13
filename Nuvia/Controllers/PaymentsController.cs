using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Payments;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Nuvia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        private int GetCurrentUserId()
        {
            var userIdString =
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userIdString) || !int.TryParse(userIdString, out var userId))
                throw new UnauthorizedAccessException("No se pudo obtener el usuario actual del token.");

            return userId;
        }

        [HttpGet]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetAll()
        {
            var list = await _paymentService.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<PaymentDTO>> GetById(int id)
        {
            var payment = await _paymentService.GetByIdAsync(id);
            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetMyPayments()
        {
            var userId = GetCurrentUserId();
            var list = await _paymentService.GetForUserAsync(userId);
            return Ok(list);
        }

        [HttpGet("me/{id}")]
        [Authorize]
        public async Task<ActionResult<PaymentDTO>> GetMyPayment(int id)
        {
            var userId = GetCurrentUserId();
            var p = await _paymentService.GetForUserByIdAsync(userId, id);
            if (p == null)
                return NotFound();

            return Ok(p);
        }

        [HttpPost("create-checkout-session")]
        [Authorize]
        public async Task<ActionResult> CreateCheckoutSession(
            [FromBody] CreateCheckoutSessionRequestDTO request,
            [FromServices] PaymentStripeService stripeService)
        {
            var userId = GetCurrentUserId();

            var (url, paymentId) = await stripeService.CreateCheckoutSessionAsync(userId, request.BookingId);

            return Ok(new
            {
                paymentId,
                url
            });
        }
    }
}
