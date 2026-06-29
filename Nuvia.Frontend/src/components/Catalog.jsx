import React, { useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
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
    const filteredProducts = products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.location.toLowerCase().includes(q);
      const matchesType = !type || product.category === type;
      const matchesDestination = !dest || product.location.toLowerCase().includes(dest);
      return matchesQuery && matchesType && matchesDestination;
    });

    switch (sort) {
      case 'price-asc':
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filteredProducts].sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  }, [products, query, type, destination, sort]);

  const types = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const clear = () => {
    setQuery('');
    setType('');
    setDestination('');
    setSort(initialSort);
  };

  return (
    <div className="catalog">
      <div className="catalog__filters">
        <div className="catalog__field">
          <label htmlFor="cat-search">Buscar</label>
          <div className="catalog__search">
            <Search className="icon" />
            <input
              id="cat-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Destino, hotel, tour..."
            />
          </div>
        </div>

        {showTypeFilter && (
          <div className="catalog__field">
            <label htmlFor="cat-type">Tipo</label>
            <select id="cat-type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">Todos</option>
              {types.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="catalog__field">
          <label htmlFor="cat-dest">Destino</label>
          <select id="cat-dest" value={destination} onChange={(event) => setDestination(event.target.value)}>
            <option value="">Todos los destinos</option>
            {destinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog__field">
          <label htmlFor="cat-sort">Ordenar</label>
          <div className="catalog__select-with-icon">
            <SlidersHorizontal className="icon" />
            <select id="cat-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" className="catalog__clear" onClick={clear}>
          <RotateCcw className="icon" /> Limpiar filtros
        </button>
      </div>

      <div className="catalog__summary">
        <p>{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</p>
      </div>

      <div className="catalog__grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
