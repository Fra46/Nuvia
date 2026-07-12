using System.ComponentModel.DataAnnotations;

namespace Nuvia.DTOs
{
    public class UserUpdateSelfDTO
    {
        [Required]
        [StringLength(150, MinimumLength = 2)]
        public string FullName { get; set; } = null!;

        [StringLength(30)]
        public string? PhoneNumber { get; set; }
    }
}