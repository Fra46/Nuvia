using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Nuvia.DTOs;
using Nuvia.Services;

namespace Nuvia.Controllers
{
    [ApiVersion("1.0")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("magic-link/request")]
        public async Task<IActionResult> RequestMagicLink([FromBody] MagicLinkRequestDTO dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            await _authService.RequestMagicLinkAsync(dto);
            return Ok(new { message = "Si el email existe, se envió un magic link." });
        }

        [HttpPost("magic-link/confirm")]
        public async Task<ActionResult<AuthResponseDTO>> ConfirmMagicLink([FromBody] MagicLinkConfirmDTO dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            try
            {
                var result = await _authService.ConfirmMagicLinkAsync(dto.Token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
