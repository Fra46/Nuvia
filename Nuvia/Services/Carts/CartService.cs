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
            var existing = await _context.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId &&
                c.ItemType == dto.ItemType &&
                c.ItemId == dto.ItemId
            );

            if (existing is null)
            {
                var entity = _mapper.Map<Cart>(dto);
                entity.UserId = userId;
                entity.CreatedAt = DateTime.UtcNow;
                entity.TotalPrice = dto.UnitPrice * dto.Quantity;

                _context.Carts.Add(entity);
                await _context.SaveChangesAsync();

                return _mapper.Map<CartDTO>(entity);
            }
            else
            {
                existing.Quantity += dto.Quantity;
                existing.TotalPrice = existing.UnitPrice * existing.Quantity;

                await _context.SaveChangesAsync();

                return _mapper.Map<CartDTO>(existing);
            }
        }

        public async Task<bool> UpdateItemAsync(int userId, int itemId, CartUpdateDTO dto)
        {
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
