using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;
using Nuvia.Services.Bookings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Nuvia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ICrudService<BookingDTO, BookingCreateDTO, BookingUpdateDTO> _crudService;

        public BookingsController(
            IBookingService bookingService,
            ICrudService<BookingDTO, BookingCreateDTO, BookingUpdateDTO> crudService)
        {
            _bookingService = bookingService;
            _crudService = crudService;
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

        // GET: api/Bookings
        [HttpGet]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<IEnumerable<BookingDTO>>> GetAllBookings()
        {
            var list = await _crudService.GetAllAsync();
            return Ok(list);
        }

        // GET: api/Bookings/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingDTO>>> GetMyBookings()
        {
            var userId = GetCurrentUserId();
            var list = await _bookingService.GetForUserAsync(userId);
            return Ok(list);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BookingDTO>> GetBooking(int id)
        {
            var booking = await _crudService.GetByIdAsync(id);
            if (booking == null)
                return NotFound();

            if (User.IsInRole("Customer"))
            {
                var userId = GetCurrentUserId();
                if (booking.UserId != userId)
                    return Forbid();
            }

            return Ok(booking);
        }

        // POST: api/Bookings
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BookingDTO>> CreateBooking(BookingCreateDTO dto)
        {
            var created = await _crudService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetBooking), new { id = created.Id }, created);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<IActionResult> UpdateBooking(int id, BookingUpdateDTO dto)
        {
            var ok = await _crudService.UpdateAsync(id, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var ok = await _crudService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        // POST: api/Bookings/checkout-from-cart
        [HttpPost("checkout-from-cart")]
        [Authorize]
        public async Task<ActionResult<BookingDTO>> CheckoutFromCart()
        {
            var userId = GetCurrentUserId();
            var booking = await _bookingService.CreateFromCartAsync(userId);

            return Ok(booking);
        }
    }
}
