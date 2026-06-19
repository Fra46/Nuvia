using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Exceptions;
using Nuvia.Models;

namespace Nuvia.Services.Payments
{
    public class PaymentService : IPaymentService
    {
        private readonly NuviaDbContext _context;
        private readonly IMapper _mapper;

        public PaymentService(NuviaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PaymentDTO>> GetAllAsync()
        {
            var payments = await _context.Payments.ToListAsync();
            return _mapper.Map<IEnumerable<PaymentDTO>>(payments);
        }

        public async Task<PaymentDTO?> GetByIdAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            return payment == null ? null : _mapper.Map<PaymentDTO>(payment);
        }

        public async Task<IEnumerable<PaymentDTO>> GetForUserAsync(int userId)
        {
            var list = await _context.Payments
                .Where(p => p.Booking.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PaymentDTO>>(list);
        }

        public async Task<PaymentDTO?> GetForUserByIdAsync(int userId, int paymentId)
        {
            var payment = await _context.Payments
                .Where(p => p.Id == paymentId && p.Booking.UserId == userId)
                .FirstOrDefaultAsync();

            return payment == null ? null : _mapper.Map<PaymentDTO>(payment);
        }

        public async Task<PaymentDTO?> GetPendingForBookingAsync(int bookingId)
        {
            var payment = await _context.Payments
                .Where(p => p.BookingId == bookingId && p.Method == PaymentMethod.Stripe && p.Status == PaymentStatus.Pending)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            return payment == null ? null : _mapper.Map<PaymentDTO>(payment);
        }

        public async Task<PaymentDTO> CreatePendingAsync(int userId, int bookingId, decimal amount)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
                throw new NotFoundException($"La reserva {bookingId} no existe.");

            if (booking.UserId != userId)
                throw new ForbiddenException("No puedes crear un pago para una reserva que no es tuya.");

            if (booking.Status != BookingStatus.Pending)
                throw new ValidationException(
                    "La reserva no está disponible para pago.",
                    new Dictionary<string, string[]>
                    {
                        ["bookingId"] = new[] { "La reserva no está en estado pendiente." }
                    });

            if (booking.TotalPrice <= 0m)
                throw new ValidationException(
                    "La reserva no tiene un total válido para pagar.",
                    new Dictionary<string, string[]>
                    {
                        ["totalPrice"] = new[] { "El total debe ser mayor que cero." }
                    });

            var approvedExists = await _context.Payments
                .AnyAsync(p => p.BookingId == bookingId && p.Method == PaymentMethod.Stripe && p.Status == PaymentStatus.Approved);

            if (approvedExists)
                throw new ValidationException(
                    "La reserva ya fue pagada.",
                    new Dictionary<string, string[]>
                    {
                        ["bookingId"] = new[] { "Existe un pago aprobado para esta reserva." }
                    });

            var existingPending = await _context.Payments
                .Where(p => p.BookingId == bookingId && p.Method == PaymentMethod.Stripe && p.Status == PaymentStatus.Pending)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (existingPending != null)
                return _mapper.Map<PaymentDTO>(existingPending);

            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = booking.TotalPrice,
                Method = PaymentMethod.Stripe,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return _mapper.Map<PaymentDTO>(payment);
        }

        public async Task<bool> MarkAsApprovedAsync(int paymentId, string? stripeIntentId = null, string? stripeSessionId = null)
        {
            var p = await _context.Payments.FindAsync(paymentId);
            if (p == null) return false;

            p.Status = PaymentStatus.Approved;

            if (!string.IsNullOrEmpty(stripeIntentId))
                p.StripePaymentIntentId = stripeIntentId;

            if (!string.IsNullOrEmpty(stripeSessionId))
                p.StripeSessionId = stripeSessionId;

            // Marcar booking como pagada
            var booking = await _context.Bookings.FindAsync(p.BookingId);
            if (booking != null)
                booking.Status = BookingStatus.Confirmed;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAsRejectedAsync(int paymentId)
        {
            var p = await _context.Payments.FindAsync(paymentId);
            if (p == null) return false;

            p.Status = PaymentStatus.Rejected;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
