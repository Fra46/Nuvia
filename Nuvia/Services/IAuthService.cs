using Nuvia.DTOs;

namespace Nuvia.Services
{
    public interface IAuthService
    {
        Task RequestMagicLinkAsync(MagicLinkRequestDTO dto);
        Task<AuthResponseDTO> ConfirmMagicLinkAsync(string token);
    }
}
