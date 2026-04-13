using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Nuvia.Data;

namespace Nuvia.Services.Base
{
    public class CrudService<TEntity, TDTO, TCreateDTO, TUpdateDTO>
        : ICrudService<TDTO, TCreateDTO, TUpdateDTO>
        where TEntity : class
    {
        protected readonly NuviaDbContext _context;
        protected readonly IMapper _mapper;
        protected readonly DbSet<TEntity> _dbSet;

        public CrudService(NuviaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task<IEnumerable<TDTO>> GetAllAsync()
        {
            var entities = await _dbSet.ToListAsync();
            return _mapper.Map<IEnumerable<TDTO>>(entities);
        }

        public virtual async Task<TDTO?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return default;

            return _mapper.Map<TDTO>(entity);
        }

        public virtual async Task<TDTO> CreateAsync(TCreateDTO dto)
        {
            var entity = _mapper.Map<TEntity>(dto);

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<TDTO>(entity);
        }

        public virtual async Task<bool> UpdateAsync(int id, TUpdateDTO dto)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();

            return true;
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
