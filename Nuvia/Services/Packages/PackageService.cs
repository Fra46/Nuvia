using AutoMapper;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Models;
using Nuvia.Services.Base;

namespace Nuvia.Services.Packages
{
    public class PackageService
        : CrudService<Package, PackageDTO, PackageCreateDTO, PackageUpdateDTO>
    {
        public PackageService(NuviaDbContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
    }
}
