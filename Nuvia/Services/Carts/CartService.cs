using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.Exceptions;
using Nuvia.Models;

namespace Nuvia.Services.Carts
{
    public class CartService : ICartService
    {
        private readonly NuviaDbContext _context;
        private readonly IMapper _mapper;

        public CartService(NuviaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CartDTO>> GetCartAsync(int userId)
        {
            var items = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CartDTO>>(items);
        }

        public async Task<CartDTO> AddItemAsync(int userId, CartCreateDTO dto)
        {
            if (dto.Quantity <= 0)
            {
                throw new ValidationException(
                    "La cantidad debe ser mayor que cero.",
                    new Dictionary<string, string[]>
                    {
                        ["quantity"] = new[] { "La cantidad del carrito debe ser un número entero positivo." }
                    });
            }

            var existing = await _context.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId &&
                c.ItemType == dto.ItemType &&
                c.ItemId == dto.ItemId
            );

            // Obtener precio y nombre desde la entidad correspondiente en la BD
            decimal unitPrice;
            string itemName;

            switch (dto.ItemType)
            {
                case CartItemType.Flight:
                    var flight = await _context.Flights.FindAsync(dto.ItemId);
                    if (flight == null)
                        throw new NotFoundException($"El vuelo {dto.ItemId} no existe.");
                    unitPrice = flight.Price;
                    itemName = $"{flight.Airline} {flight.FlightCode} {flight.Origin}-{flight.Destination}";
                    break;

                case CartItemType.Hotel:
                    var hotel = await _context.Hotels.FindAsync(dto.ItemId);
                    if (hotel == null)
                        throw new NotFoundException($"El hotel {dto.ItemId} no existe.");
                    unitPrice = hotel.PricePerNight;
                    itemName = hotel.Name;
                    break;

                case CartItemType.Tour:
                    var tour = await _context.Tours.FindAsync(dto.ItemId);
                    if (tour == null)
                        throw new NotFoundException($"El tour {dto.ItemId} no existe.");
                    unitPrice = tour.PricePerPerson;
                    itemName = tour.Name;
                    break;

                case CartItemType.Package:
                    var package = await _context.Packages.FindAsync(dto.ItemId);
                    if (package == null)
                        throw new NotFoundException($"El paquete {dto.ItemId} no existe.");
                    unitPrice = package.TotalPrice;
                    itemName = package.Title;
                    break;

                default:
                    throw new ValidationException("Tipo de ítem no soportado", new Dictionary<string, string[]>
                    {
                        ["itemType"] = new[] { "Tipo de ítem inválido." }
                    });
            }

            if (existing is null)
            {
                var entity = new Cart
                {
                    UserId = userId,
                    ItemType = dto.ItemType,
                    ItemId = dto.ItemId,
                    ItemName = itemName,
                    Quantity = dto.Quantity > 0 ? dto.Quantity : 1,
                    UnitPrice = unitPrice,
                    CreatedAt = DateTime.UtcNow,
                    TotalPrice = unitPrice * (dto.Quantity > 0 ? dto.Quantity : 1)
                };

                _context.Carts.Add(entity);
                await _context.SaveChangesAsync();

                return _mapper.Map<CartDTO>(entity);
            }
            else
            {
                existing.Quantity += dto.Quantity > 0 ? dto.Quantity : 1;
                existing.TotalPrice = existing.UnitPrice * existing.Quantity;

                await _context.SaveChangesAsync();

                return _mapper.Map<CartDTO>(existing);
            }
        }

        public async Task<bool> UpdateItemAsync(int userId, int itemId, CartUpdateDTO dto)
        {
            if (dto.Quantity <= 0)
            {
                throw new ValidationException(
                    "La cantidad debe ser mayor que cero.",
                    new Dictionary<string, string[]>
                    {
                        ["quantity"] = new[] { "La cantidad del carrito debe ser un número entero positivo." }
                    });
            }

            var entity = await _context.Carts
                .FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);

            if (entity is null)
                return false;

            entity.Quantity = dto.Quantity;
            entity.TotalPrice = entity.UnitPrice * entity.Quantity;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveItemAsync(int userId, int itemId)
        {
            var entity = await _context.Carts
                .FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);

            if (entity is null)
                return false;

            _context.Carts.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ClearCartAsync(int userId)
        {
            var items = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            _context.Carts.RemoveRange(items);
            await _context.SaveChangesAsync();
        }

        public async Task<CartSummaryDTO> GetSummaryAsync(int userId)
        {
            var items = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            var dtos = _mapper.Map<List<CartDTO>>(items);

            var totalItems = items.Sum(i => i.Quantity);
            var subtotal = items.Sum(i => i.TotalPrice);

            return new CartSummaryDTO
            {
                TotalItems = totalItems,
                Subtotal = subtotal,
                Items = dtos
            };
        }
    }
}
