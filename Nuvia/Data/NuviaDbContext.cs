using Microsoft.EntityFrameworkCore;
using Nuvia.Models;

namespace Nuvia.Data
{
    public class NuviaDbContext : DbContext
    {
        public NuviaDbContext(DbContextOptions<NuviaDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Cart> Carts { get; set; }
    }
}
