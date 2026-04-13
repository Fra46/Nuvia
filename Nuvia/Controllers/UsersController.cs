using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Nuvia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NuviaDbContext _context;
        private readonly IMapper _mapper;

        public UsersController(NuviaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            var dtos = _mapper.Map<List<UserDTO>>(users);
            return Ok(dtos);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<UserDTO>(user);
            return Ok(dto);
        }

        // GET: api/Users/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetMe()
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrEmpty(sub)) return Unauthorized();

            if (!int.TryParse(sub, out var userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            return Ok(_mapper.Map<UserDTO>(user));
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> PutUser(int id, UserDTO userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Mapear del DTO a la entidad existente (sin tocar campos internos del magic link)
            _mapper.Map(userDto, user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDTO>> PostUser(UserCreateDto createDto)
        {
            var user = _mapper.Map<User>(createDto);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<UserDTO>(user);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, dto);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
