using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Exceptions;
using Nuvia.Models;
using Nuvia.Services;
using Nuvia.Services.Base;

namespace Nuvia.Services.Bookings
{
    public class BookingService
        : CrudService<Booking, BookingDTO, BookingCreateDTO, BookingUpdateDTO>,
          IBookingService
    {
        private readonly IEmailSender _emailSender;

        public BookingService(
            NuviaDbContext context,
            IMapper mapper,
            IEmailSender emailSender)
            : base(context, mapper)
        {
            _emailSender = emailSender;
        }

        public async Task<IEnumerable<BookingDTO>> GetForUserAsync(int userId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<BookingDTO>>(bookings);
        }

        public async Task<BookingDTO> CreateFromCartAsync(int userId)
        {
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                throw new ValidationException(
                    "El carrito está vacío.",
                    new Dictionary<string, string[]>
                    {
                        ["cart"] = new[] { "No hay ítems en el carrito para crear una reserva." }
                    });
            }

            var first = cartItems.First();
            var itemType = first.ItemType;

            if (cartItems.Any(i => i.ItemType != itemType))
            {
                throw new ValidationException(
                    "El carrito contiene elementos de diferentes tipos.",
                    new Dictionary<string, string[]>
                    {
                        ["cart"] = new[]
                        {
                            "Mezclar vuelos, hoteles, tours y paquetes en la misma reserva aún no está soportado."
                        }
                    });
            }

            decimal total = 0m;
            int totalQuantity = 0;

            foreach (var item in cartItems)
            {
                totalQuantity += item.Quantity;

                // Usar TotalPrice si viene seteado correctamente
                var lineTotal = item.TotalPrice;

                // Fallback defensivo por si algún registro viejo viene sin TotalPrice calculado
                if (lineTotal == 0m && item.UnitPrice > 0m && item.Quantity > 0)
                {
                    lineTotal = item.UnitPrice * item.Quantity;
                }

                total += lineTotal;
            }

            int? flightId = null;
            int? hotelId = null;
            int? tourId = null;
            int? packageId = null;

            switch (itemType)
            {
                case CartItemType.Flight:
                    flightId = first.ItemId;
                    break;

                case CartItemType.Hotel:
                    hotelId = first.ItemId;
                    break;

                case CartItemType.Tour:
                    tourId = first.ItemId;
                    break;

                case CartItemType.Package:
                    packageId = first.ItemId;
                    break;
            }

            var booking = new Booking
            {
                UserId = userId,
                BookingDate = DateTime.UtcNow,
                BookingCode = Guid.NewGuid().ToString("N").ToUpperInvariant(),
                FlightId = flightId,
                HotelId = hotelId,
                TourId = tourId,
                PackageId = packageId,
                Quantity = totalQuantity,
                TotalPrice = total,
                Status = BookingStatus.Pending
            };

            _context.Bookings.Add(booking);

            _context.Carts.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                await _emailSender.SendBookingConfirmationAsync(
                    user.Email,
                    user.FullName ?? user.Email,
                    booking.BookingCode,
                    booking.BookingDate,
                    booking.TotalPrice
                );
            }

            return _mapper.Map<BookingDTO>(booking);
        }
    }
}
