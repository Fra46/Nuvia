using AutoMapper;
using Nuvia.DTOs;
using Nuvia.Models;

namespace Nuvia.Profiles
{
    public class NuviaProfile : Profile
    {
        public NuviaProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
                .ForMember(dest => dest.MagicLinkToken, opt => opt.Ignore())
                .ForMember(dest => dest.MagicLinkExpiresAt, opt => opt.Ignore());
            CreateMap<UserCreateDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true))
                .ForMember(dest => dest.EmailVerified, opt => opt.MapFrom(_ => false))
                .ForMember(dest => dest.MagicLinkToken, opt => opt.Ignore())
                .ForMember(dest => dest.MagicLinkExpiresAt, opt => opt.Ignore());

            CreateMap<Flight, FlightDTO>().ReverseMap();
            CreateMap<FlightCreateDTO, Flight>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));
            CreateMap<FlightUpdateDTO, Flight>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Hotel, HotelDTO>().ReverseMap();
            CreateMap<HotelCreateDTO, Hotel>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));
            CreateMap<HotelUpdateDTO, Hotel>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<TourPricing, TourPricingDTO>().ReverseMap();
            CreateMap<Tour, TourDTO>()
                .ForMember(dest => dest.Rates, opt => opt.MapFrom(src => src.Rates));
            CreateMap<TourDTO, Tour>();
            CreateMap<TourCreateDTO, Tour>()
                .ForMember(dest => dest.Rates, opt => opt.Ignore());
            CreateMap<TourUpdateDTO, Tour>()
                .ForMember(dest => dest.Rates, opt => opt.Ignore());

            CreateMap<Package, PackageDTO>().ReverseMap();
            CreateMap<PackageCreateDTO, Package>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));
            CreateMap<PackageUpdateDTO, Package>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Booking, BookingDTO>().ReverseMap();
            CreateMap<BookingCreateDTO, Booking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.BookingCode, opt => opt.MapFrom(_ => Guid.NewGuid().ToString("N")))
                .ForMember(dest => dest.BookingDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => BookingStatus.Pending))
                .ForMember(dest => dest.Payment, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Flight, opt => opt.Ignore())
                .ForMember(dest => dest.Hotel, opt => opt.Ignore())
                .ForMember(dest => dest.Tour, opt => opt.Ignore())
                .ForMember(dest => dest.Package, opt => opt.Ignore());
            CreateMap<BookingUpdateDTO, Booking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.BookingCode, opt => opt.Ignore())
                .ForMember(dest => dest.BookingDate, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.FlightId, opt => opt.Ignore())
                .ForMember(dest => dest.HotelId, opt => opt.Ignore())
                .ForMember(dest => dest.TourId, opt => opt.Ignore())
                .ForMember(dest => dest.PackageId, opt => opt.Ignore())
                .ForMember(dest => dest.Payment, opt => opt.Ignore());

            CreateMap<Payment, PaymentDTO>().ReverseMap();
            CreateMap<PaymentCreateDTO, Payment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Booking, opt => opt.Ignore());
            CreateMap<PaymentUpdateDTO, Payment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.BookingId, opt => opt.Ignore())
                .ForMember(dest => dest.Booking, opt => opt.Ignore());

            CreateMap<Cart, CartDTO>().ReverseMap();
            CreateMap<CartCreateDTO, Cart>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
            CreateMap<CartUpdateDTO, Cart>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
