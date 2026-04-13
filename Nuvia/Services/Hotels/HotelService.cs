using AutoMapper;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Services.Hotels
{
    public class HotelService
        : CrudService<Hotel, HotelDTO, HotelCreateDTO, HotelUpdateDTO>
    {
        public HotelService(NuviaDbContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}