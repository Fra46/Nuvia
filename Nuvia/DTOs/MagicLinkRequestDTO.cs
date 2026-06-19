using System.ComponentModel.DataAnnotations;

namespace Nuvia.DTOs
{
    public class MagicLinkRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}
