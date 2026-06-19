using Microsoft.IdentityModel.Tokens;
using Nuvia.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Nuvia.JWT
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration _config;

        public JwtTokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user, out DateTime expiresAt)
        {
            var keyString = _config["JwtSettings:Key"];

            if (string.IsNullOrWhiteSpace(keyString))
                throw new InvalidOperationException("JwtSettings:Key no está configurada.");

            var keyBytes = Encoding.UTF8.GetBytes(keyString);

            if (keyBytes.Length < 32)
                throw new InvalidOperationException("JwtSettings:Key debe tener al menos 32 bytes (256 bits).");

            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Rol: Admin / Agent / Customer
            var role = user.Role.ToString();
            if (!string.IsNullOrWhiteSpace(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];

            var durationConfig = _config["JwtSettings:AccessTokenMinutes"];
            if (!double.TryParse(durationConfig, out double durationInMinutes))
            {
                durationInMinutes = 60; // default fallback
            }

            var now = DateTime.UtcNow;
            expiresAt = now.AddMinutes(durationInMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: now,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
