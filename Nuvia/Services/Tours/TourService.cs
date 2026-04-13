using AutoMapper;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Services.Tours
{
    public class TourService
        : CrudService<Tour, TourDTO, TourCreateDTO, TourUpdateDTO>
    {
        public TourService(NuviaDbContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
    }
}
