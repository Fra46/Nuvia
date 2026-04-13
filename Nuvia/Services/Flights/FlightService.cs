using AutoMapper;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Services.Flights
{
    public class FlightService
        : CrudService<Flight, FlightDTO, FlightCreateDTO, FlightUpdateDTO>
    {
        public FlightService(NuviaDbContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

    }
}