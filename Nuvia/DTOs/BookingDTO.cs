using Nuvia.Models;

namespace Nuvia.DTOs
{
    public class BookingDTO
    {
        public int Id { get; set; }
        public string BookingCode { get; set; } = null!;
        public DateTime BookingDate { get; set; }

        public int UserId { get; set; }

        public int? FlightId { get; set; }
        public int? HotelId { get; set; }
        public int? TourId { get; set; }
        public int? PackageId { get; set; }

        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }

        public BookingStatus Status { get; set; }
    }
}
