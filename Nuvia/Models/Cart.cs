namespace Nuvia.Models
{
    public enum CartItemType
    {
        Flight = 1,
        Hotel = 2,
        Tour = 3,
        Package = 4
    }

    public class Cart
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public CartItemType ItemType { get; set; }

        public int ItemId { get; set; }
        public string ItemName { get; set; } = null!;

        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal TotalPrice { get; internal set; }
    }
}
