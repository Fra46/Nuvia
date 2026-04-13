namespace Nuvia.DTOs
{
    public class CartSummaryDTO
    {
        public int TotalItems { get; set; }
        public decimal Subtotal { get; set; }
        public IEnumerable<CartDTO> Items { get; set; } = new List<CartDTO>();
    }
}
