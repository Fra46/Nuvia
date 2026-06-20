using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly ICrudService<HotelDTO, HotelCreateDTO, HotelUpdateDTO> _service;

        public HotelsController(ICrudService<HotelDTO, HotelCreateDTO, HotelUpdateDTO> service)
        {
            _service = service;
        }

        // GET: api/Hotels (público)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<HotelDTO>>> GetHotels()
        {
            var hotels = await _service.GetAllAsync();
            return Ok(hotels);
        }

        // GET: api/Hotels/5 (público)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<HotelDTO>> GetHotel(int id)
        {
            var hotel = await _service.GetByIdAsync(id);
            if (hotel == null)
                return NotFound();

            return Ok(hotel);
        }

        // POST: api/Hotels (Admin,Agent)
        [HttpPost]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<HotelDTO>> PostHotel(HotelCreateDTO dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetHotel), new { id = created.Id }, created);
        }

        // PUT: api/Hotels/5 (Admin,Agent)
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<IActionResult> PutHotel(int id, HotelUpdateDTO dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

        // DELETE: api/Hotels/5 (Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}
