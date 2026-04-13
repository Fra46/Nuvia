namespace Nuvia.Services.Base
{
    public interface ICrudService<TDTO, TCreateDTO, TUpdateDTO>
    {
        Task<IEnumerable<TDTO>> GetAllAsync();
        Task<TDTO?> GetByIdAsync(int id);
        Task<TDTO> CreateAsync(TCreateDTO dto);
        Task<bool> UpdateAsync(int id, TUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
