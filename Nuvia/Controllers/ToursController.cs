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
    public class ToursController : ControllerBase
    {
        private readonly ICrudService<TourDTO, TourCreateDTO, TourUpdateDTO> _service;

        public ToursController(ICrudService<TourDTO, TourCreateDTO, TourUpdateDTO> service)
        {
            _service = service;
        }

        // GET: api/Tours (público)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TourDTO>>> GetTours()
        {
            var tours = await _service.GetAllAsync();
            return Ok(tours);
        }

        // GET: api/Tours/5 (público)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<TourDTO>> GetTour(int id)
        {
            var tour = await _service.GetByIdAsync(id);
            if (tour == null)
                return NotFound();

            return Ok(tour);
        }

        // POST: api/Tours (Admin, Agent)
        [HttpPost]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<TourDTO>> PostTour(TourCreateDTO dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetTour), new { id = created.Id }, created);
        }

        // PUT: api/Tours/5 (Admin, Agent)
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<IActionResult> PutTour(int id, TourUpdateDTO dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

        // DELETE: api/Tours/5 (solo Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}
