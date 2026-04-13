namespace Nuvia.DTOs
{
    public class BookingCreateDTO
    {
        public int UserId { get; set; }

        public int? FlightId { get; set; }
        public int? HotelId { get; set; }
        public int? TourId { get; set; }
        public int? PackageId { get; set; }

        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
