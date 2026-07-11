using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Exceptions;
using Nuvia.Models;
using Nuvia.Services.Base;
using System.Linq;
using System.Collections.Generic;

namespace Nuvia.Services.Tours
{
    public class TourService
        : CrudService<Tour, TourDTO, TourCreateDTO, TourUpdateDTO>
    {
        public TourService(NuviaDbContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        private void ValidateRates(IEnumerable<Nuvia.DTOs.TourPricingDTO>? rates)
        {
            if (rates == null) return;

            // Validate each rate
            foreach (var r in rates)
            {
                if (r.MinPeople > r.MaxPeople)
                    throw new ArgumentException("min_people must be less or equal than max_people");
                if (r.TotalPrice <= 0)
                    throw new ArgumentException("total_price must be greater than zero");
            }

            // Check for overlaps
            var ordered = rates.OrderBy(r => r.MinPeople).ToList();
            for (int i = 1; i < ordered.Count; i++)
            {
                if (ordered[i].MinPeople <= ordered[i - 1].MaxPeople)
                    throw new ArgumentException("Tarifas con rangos superpuestos no están permitidas.");
            }
        }

        public override async Task<TourDTO> CreateAsync(TourCreateDTO dto)
        {
            // Validate rates
            ValidateRates(dto.Rates);

            // Map tour and explicitly assign rates to avoid missing collection persistence
            var tour = _mapper.Map<Tour>(dto);
            if (dto.Rates != null && dto.Rates.Any())
            {
                tour.Rates = dto.Rates.Select(r => new TourPricing
                {
                    MinPeople = r.MinPeople,
                    MaxPeople = r.MaxPeople,
                    TotalPrice = r.TotalPrice,
                    CreatedAt = DateTime.UtcNow
                }).ToList();
            }
            else if (tour.PricePerPerson > 0)
            {
                var max = tour.AvailableSlots > 0 ? tour.AvailableSlots : 999;
                tour.Rates = new List<TourPricing>
                {
                    new TourPricing { MinPeople = 1, MaxPeople = max, TotalPrice = tour.PricePerPerson * 1 }
                };
            }
            else
            {
                throw new ValidationException("El tour debe incluir al menos una tarifa o un precio por persona.", new Dictionary<string, string[]>
                {
                    ["rates"] = new[] { "Se requiere al menos una tarifa válida para el tour." }
                });
            }

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            return _mapper.Map<TourDTO>(tour);
        }

        public override async Task<IEnumerable<TourDTO>> GetAllAsync()
        {
            var entities = await _context.Tours
                .Include(t => t.Rates)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TourDTO>>(entities);
        }

        public override async Task<TourDTO?> GetByIdAsync(int id)
        {
            var entity = await _context.Tours
                .Include(t => t.Rates)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (entity == null) return default;

            return _mapper.Map<TourDTO>(entity);
        }

        public override async Task<bool> UpdateAsync(int id, TourUpdateDTO dto)
        {
            ValidateRates(dto.Rates);

            var entity = await _context.Tours.Include(t => t.Rates).FirstOrDefaultAsync(t => t.Id == id);
            if (entity == null) return false;

            // Map scalar fields
            _mapper.Map(dto, entity);

            // Replace rates: simple strategy - remove existing and add new
            if (entity.Rates != null)
            {
                _context.TourPricings.RemoveRange(entity.Rates);
            }

            if (dto.Rates != null)
            {
                entity.Rates = dto.Rates.Select(r => new TourPricing
                {
                    MinPeople = r.MinPeople,
                    MaxPeople = r.MaxPeople,
                    TotalPrice = r.TotalPrice,
                    CreatedAt = DateTime.UtcNow
                }).ToList();
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
