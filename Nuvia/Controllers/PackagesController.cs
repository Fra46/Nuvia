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
    public class PackagesController : ControllerBase
    {
        private readonly ICrudService<PackageDTO, PackageCreateDTO, PackageUpdateDTO> _service;

        public PackagesController(ICrudService<PackageDTO, PackageCreateDTO, PackageUpdateDTO> service)
        {
            _service = service;
        }

        // GET: api/Packages (público)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PackageDTO>>> GetPackages()
        {
            var packages = await _service.GetAllAsync();
            return Ok(packages);
        }

        // GET: api/Packages/5 (público)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PackageDTO>> GetPackage(int id)
        {
            var package = await _service.GetByIdAsync(id);
            if (package == null)
                return NotFound();

            return Ok(package);
        }

        // POST: api/Packages (Admin, Agent)
        [HttpPost]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<ActionResult<PackageDTO>> PostPackage(PackageCreateDTO dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetPackage), new { id = created.Id }, created);
        }

        // PUT: api/Packages/5 (Admin, Agent)
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.AdminOrAgent)]
        public async Task<IActionResult> PutPackage(int id, PackageUpdateDTO dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

        // DELETE: api/Packages/5 (solo Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeletePackage(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}
