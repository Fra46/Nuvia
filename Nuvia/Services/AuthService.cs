using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.JWT;
using Nuvia.Models;
using System.Security.Cryptography;

namespace Nuvia.Services
{
    public class AuthService : IAuthService
    {
        private readonly NuviaDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public AuthService(
            NuviaDbContext context,
            IJwtTokenGenerator jwtTokenGenerator,
            IConfiguration configuration,
            IMapper mapper,
            IEmailSender emailSender)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        public async Task RequestMagicLinkAsync(MagicLinkRequestDTO dto)
        {
            var email = dto.Email.Trim().ToLower();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                user = new User
                {
                    FullName = email,
                    Email = email,
                    Role = UserRole.Customer,
                    IsActive = true,
                    EmailVerified = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
            }

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(tokenBytes);

            user.MagicLinkToken = token;
            user.MagicLinkExpiresAt = DateTime.UtcNow.AddMinutes(15);

            await _context.SaveChangesAsync();

            var baseUrl = _configuration.GetSection("MagicLink").GetValue<string>("BaseUrl");
            var magicLinkUrl = $"{baseUrl}/auth/magic-login?token={Uri.EscapeDataString(token)}";

            await _emailSender.SendMagicLinkAsync(user.Email, magicLinkUrl, user.FullName);
        }

        public async Task<AuthResponseDTO> ConfirmMagicLinkAsync(string token)
        {
            var now = DateTime.UtcNow;

            var decodedToken = Uri.UnescapeDataString(token);

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.MagicLinkToken == decodedToken &&
                    u.MagicLinkExpiresAt != null &&
                    u.MagicLinkExpiresAt > now);

            if (user == null)
            {
                throw new InvalidOperationException("El magic link es inválido o ha expirado.");
            }

            user.MagicLinkToken = null;
            user.MagicLinkExpiresAt = null;
            user.EmailVerified = true;
            user.LastLoginAt = now;

            await _context.SaveChangesAsync();

            var accessToken = _jwtTokenGenerator.GenerateToken(user, out var expiresAt);

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserDTO>(user)
            };
        }
    }
}
