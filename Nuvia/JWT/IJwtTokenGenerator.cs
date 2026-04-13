using Nuvia.Models;

namespace Nuvia.JWT
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, out DateTime expiresAt);
    }
}
