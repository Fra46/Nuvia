using Microsoft.Extensions.Options;
using Nuvia.JWT;
using Nuvia.Models;
using Nuvia.Settings;

namespace Nuvia.Tests;

public class JwtTokenGeneratorTests
{
    [Fact]
    public void GenerateToken_ReturnsToken_WhenSettingsValid()
    {
        var settings = new JwtSettings
        {
            Key = new string('a', 32),
            Issuer = "test-issuer",
            Audience = "test-audience",
            AccessTokenMinutes = 60
        };

        var generator = new JwtTokenGenerator(Options.Create(settings));

        var user = new User
        {
            Id = 1,
            FullName = "Test User",
            Email = "test@example.com",
            Role = Nuvia.Models.UserRole.Customer
        };

        var token = generator.GenerateToken(user, out var expiresAt);

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.True(expiresAt > DateTime.UtcNow);
    }
}
