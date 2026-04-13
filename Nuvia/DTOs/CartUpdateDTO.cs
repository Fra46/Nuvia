using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class CartUpdateDTO
    {
        public int UserId { get; set; }

        public CartItemType ItemType { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
