using System.ComponentModel.DataAnnotations;
using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class CartCreateDTO
    {
        [Required]
        public CartItemType ItemType { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ItemId debe ser mayor que cero.")]
        public int ItemId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity debe ser mayor que cero.")]
        public int Quantity { get; set; }
    }
}
