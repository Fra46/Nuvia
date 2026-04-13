namespace Nuvia.Models
{
    public class Flight
    {
        public int Id { get; set; }

        public string Airline { get; set; } = null!;
        public string FlightCode { get; set; } = null!;

        public string Origin { get; set; } = null!;
        public string Destination { get; set; } = null!;

        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }

        public bool IsActive { get; set; } = true;

        // Navegación
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
    }
}
