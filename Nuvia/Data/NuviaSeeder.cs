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

            if (context.Users.Any())
            {
                // Ya existe una base de datos con usuarios; no semillamos para no interferir.
                return;
            }

            var adminEmails = new[]
            {
                "anddanmairubzapcastorgut@gmail.com",
                "andresfzapatamar@gmail.com"
            };

            foreach (var adminEmail in adminEmails)
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
            }

            context.SaveChanges();
        }
    }
}
