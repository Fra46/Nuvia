using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly ICrudService<FlightDTO, FlightCreateDTO, FlightUpdateDTO> _service;

        public FlightsController(ICrudService<FlightDTO, FlightCreateDTO, FlightUpdateDTO> service)
        {
            _service = service;
        }

        // GET: api/Flights (público)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<FlightDTO>>> GetFlights()
        {
            var flights = await _service.GetAllAsync();
            return Ok(flights);
        }

        // GET: api/Flights/5 (público)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<FlightDTO>> GetFlight(int id)
        {
            var flight = await _service.GetByIdAsync(id);
            if (flight == null)
                return NotFound();

            return Ok(flight);
        }

        // POST: api/Flights (solo Admin, Agent)
        [HttpPost]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<FlightDTO>> PostFlight(FlightCreateDTO dto)
        {
            var created = await _service.CreateAsync(dto);

            // created.Id lo tienes en el DTO si lo mapeas así
            return CreatedAtAction(nameof(GetFlight), new { id = created.Id }, created);
        }

        // PUT: api/Flights/5
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<IActionResult> PutFlight(int id, FlightUpdateDTO dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

        // DELETE: api/Flights/5
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}
