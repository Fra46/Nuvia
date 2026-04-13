using Nuvia.DTOs;
using Nuvia.Services.Base;

namespace Nuvia.Services.Bookings
{
    public interface IBookingService
        : ICrudService<BookingDTO, BookingCreateDTO, BookingUpdateDTO>
    {
        Task<IEnumerable<BookingDTO>> GetForUserAsync(int userId);
        Task<BookingDTO> CreateFromCartAsync(int userId);
    }
}
