using Nuvia.DTOs;

namespace Nuvia.Services.Carts
{
    public interface ICartService
    {
        Task<IEnumerable<CartDTO>> GetCartAsync(int userId);
        Task<CartDTO> AddItemAsync(int userId, CartCreateDTO dto);
        Task<bool> UpdateItemAsync(int userId, int cartItemId, CartUpdateDTO dto);
        Task<bool> RemoveItemAsync(int userId, int cartItemId);
        Task ClearCartAsync(int userId);
        Task<CartSummaryDTO> GetSummaryAsync(int userId);
    }
}
