using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nuvia.DTOs;
using Nuvia.Services.Carts;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Nuvia.Controllers
{
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
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

        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<CartDTO>>> GetMyCart()
        {
            var userId = GetCurrentUserId();
            var items = await _cartService.GetCartAsync(userId);
            return Ok(items);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<CartSummaryDTO>> GetSummary()
        {
            var userId = GetCurrentUserId();
            var summary = await _cartService.GetSummaryAsync(userId);
            return Ok(summary);
        }


        [HttpPost("add")]
        public async Task<ActionResult<CartDTO>> AddToCart(CartCreateDTO dto)
        {
            var userId = GetCurrentUserId();
            var created = await _cartService.AddItemAsync(userId, dto);
            return Ok(created);
        }

        [HttpPut("update/{itemId}")]
        public async Task<IActionResult> UpdateItem(int itemId, CartUpdateDTO dto)
        {
            var userId = GetCurrentUserId();
            var ok = await _cartService.UpdateItemAsync(userId, itemId, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("remove/{itemId}")]
        public async Task<IActionResult> RemoveItem(int itemId)
        {
            var userId = GetCurrentUserId();
            var ok = await _cartService.RemoveItemAsync(userId, itemId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = GetCurrentUserId();
            await _cartService.ClearCartAsync(userId);
            return NoContent();
        }
    }
}
