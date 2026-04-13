using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Nuvia.Models;

namespace Nuvia.Data
{
    public static class NuviaSeeder
    {
        public static void Seed(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<NuviaDbContext>();

            context.Database.Migrate();

            const string adminEmail = "anddanmairubzapcastorgut@gmail.com";

            if (!context.Users.Any(u => u.Email == adminEmail))
            {
                var admin = new User
                {
                    FullName = "Admin Nuvia",
                    Email = adminEmail,
                    Role = UserRole.Admin,
                    IsActive = true,
                    EmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }
}
