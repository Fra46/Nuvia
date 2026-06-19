using System.ComponentModel.DataAnnotations;
using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class CartUpdateDTO
    {
        /// <summary>
        /// El servidor solo actualiza la cantidad del ítem.
        /// Los demás campos (ItemName, UnitPrice, etc.) son ignorados.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity debe ser mayor que cero.")]
        public int Quantity { get; set; }
    }
}
