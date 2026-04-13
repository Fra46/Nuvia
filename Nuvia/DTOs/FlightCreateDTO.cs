namespace Nuvia.DTOs
{
    public class FlightCreateDTO
    {
        public string Airline { get; set; } = null!;
        public string FlightCode { get; set; } = null!;

        public string Origin { get; set; } = null!;
        public string Destination { get; set; } = null!;

        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
    }
}
