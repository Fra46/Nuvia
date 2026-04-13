namespace Nuvia.Models
{
    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Cancelled = 3
    }

    public class Booking
    {
        public int Id { get; set; }

        public string BookingCode { get; set; } = Guid.NewGuid().ToString("N");
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? FlightId { get; set; }
        public Flight? Flight { get; set; }

        public int? HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        public int? TourId { get; set; }
        public Tour? Tour { get; set; }

        public int? PackageId { get; set; }
        public Package? Package { get; set; }

        public int Quantity { get; set; } = 1;
        public decimal TotalPrice { get; set; }

        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        // Navegación
        public Payment? Payment { get; set; }
    }
}
