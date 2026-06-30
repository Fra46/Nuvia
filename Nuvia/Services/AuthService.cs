using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.JWT;
using Nuvia.Models;
using Nuvia.Settings;
using System.Security.Cryptography;

namespace Nuvia.Services
{
    public class AuthService : IAuthService
    {
        private readonly NuviaDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly MagicLinkSettings _magicLinkSettings;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public AuthService(
            NuviaDbContext context,
            IJwtTokenGenerator jwtTokenGenerator,
            IOptions<MagicLinkSettings> magicLinkSettings,
            IMapper mapper,
            IEmailSender emailSender)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
            _magicLinkSettings = magicLinkSettings.Value;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        public async Task RequestMagicLinkAsync(MagicLinkRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("El email no puede estar vacío.", nameof(dto.Email));

            var email = dto.Email.Trim().ToLower();

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("El email no puede estar vacío o contener solo espacios.", nameof(dto.Email));

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

            var magicLinkUrl = $"{_magicLinkSettings.BaseUrl}/auth/magic-login?token={Uri.EscapeDataString(token)}";

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
