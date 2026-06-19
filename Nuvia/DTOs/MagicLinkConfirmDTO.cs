using System.ComponentModel.DataAnnotations;

namespace Nuvia.DTOs
{
    public class MagicLinkConfirmDTO
    {
        [Required]
        public string Token { get; set; } = null!;
    }
}
