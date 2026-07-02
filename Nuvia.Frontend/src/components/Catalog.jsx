import React, { useMemo, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { destinations, categoryLabels } from '../data/products';

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

export default function Catalog({ products, showTypeFilter = true, initialSort = 'relevance' }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [destination, setDestination] = useState('');
  const [sort, setSort] = useState(initialSort);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const dest = destination.toLowerCase();
    const result = products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchesType = !type || p.category === type;
      const matchesDest = !dest || p.location.toLowerCase().includes(dest);
      return matchesQuery && matchesType && matchesDest;
    });

    switch (sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [products, query, type, destination, sort]);

  const types = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  function clear() {
    setQuery('');
    setType('');
    setDestination('');
    setSort(initialSort);
  }

  return (
    <div>
      <div className="nv-card p-3 p-md-4" style={{ borderRadius: '1.5rem' }}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label htmlFor="cat-search" className="form-label text-uppercase-xs text-muted-nv">
              Buscar
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-nv">
                <Search size={16} className="text-muted-nv" />
              </span>
              <input
                id="cat-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Destino, hotel, tour..."
                className="form-control border-nv"
              />
            </div>
          </div>

          {showTypeFilter && (
            <div className="col-6 col-md-2">
              <label htmlFor="cat-type" className="form-label text-uppercase-xs text-muted-nv">
                Tipo
              </label>
              <select
                id="cat-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-select border-nv"
              >
                <option value="">Todos</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {categoryLabels[t]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={showTypeFilter ? 'col-6 col-md-3' : 'col-12 col-md-4'}>
            <label htmlFor="cat-dest" className="form-label text-uppercase-xs text-muted-nv">
              Destino
            </label>
            <select
              id="cat-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="form-select border-nv"
            >
              <option value="">Todos los destinos</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className={showTypeFilter ? 'col-8 col-md-2' : 'col-8 col-md-3'}>
            <label htmlFor="cat-sort" className="form-label text-uppercase-xs text-muted-nv">
              Ordenar
            </label>
            <select
              id="cat-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select border-nv"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-4 col-md-1">
            <label className="form-label text-uppercase-xs text-muted-nv d-none d-md-block">&nbsp;</label>
            <button
              type="button"
              onClick={clear}
              className="btn btn-light border-nv w-100 d-inline-flex align-items-center justify-content-center gap-2"
              aria-label="Limpiar filtros"
            >
              <RotateCcw size={16} />
              <span className="d-md-none">Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4">
        <p className="small text-muted-nv mb-0">
          <span className="fw-semibold" style={{ color: 'var(--nv-ink)' }}>
            {filtered.length}
          </span>{' '}
          {filtered.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="row g-4 mt-1">
          {filtered.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="nv-card d-flex flex-column align-items-center justify-content-center text-center py-5 mt-4">
          <Search size={40} className="text-muted-nv" />
          <h3 className="font-heading fs-4 fw-semibold mt-3">Sin resultados</h3>
          <p className="small text-muted-nv">Prueba ajustando tu búsqueda o filtros.</p>
          <button type="button" onClick={clear} className="btn btn-teal rounded-pill px-4 mt-2">
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
