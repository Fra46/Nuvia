import React, { useState } from 'react';
import { Check, Clock, MapPin, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categoryLabels, formatCOP } from '../data/productHelpers';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="nv-card h-100 d-flex flex-column">
      <div className="position-relative" style={{ aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} className="img-cover" />
        <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-between p-3">
          <span className="chip bg-white text-teal text-uppercase-xs shadow-sm">
            {categoryLabels[product.category]}
          </span>
          <span className="chip bg-white shadow-sm" style={{ color: 'var(--nv-ink)' }}>
            <Star size={14} className="text-amber" fill="currentColor" />
            {product.rating}
          </span>
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1 p-4">
        <div className="d-flex align-items-center gap-2 small text-muted-nv">
          <MapPin size={14} className="text-amber" />
          <span className="text-truncate">{product.location}</span>
          {product.meta && (
            <>
              <span aria-hidden>·</span>
              <Clock size={14} className="text-amber" />
              <span className="text-truncate">{product.meta}</span>
            </>
          )}
        </div>

        <h3 className="font-heading fs-4 fw-semibold lh-sm mt-2 mb-1">{product.name}</h3>
        <p className="small text-muted-nv clamp-2 mb-0" style={{ lineHeight: 1.5 }}>
          {product.description}
        </p>

        {product.features?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {product.features.slice(0, 3).map((feature) => (
              <span key={feature} className="chip bg-sand" style={{ color: 'var(--nv-ink)', fontWeight: 500 }}>
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex align-items-end justify-content-between gap-3 mt-auto pt-3 border-top border-nv">
          <div>
            <p className="small text-muted-nv mb-0">
              {product.priceMax && product.priceMax > product.price ? 'Desde' : 'Precio'}
            </p>
            <p className="font-heading fs-3 fw-semibold mb-0">{formatCOP(product.price)}</p>
            {product.priceMax && product.priceMax > product.price && (
              <p className="small text-muted-nv mb-0">hasta {formatCOP(product.priceMax)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`btn rounded-pill px-3 d-inline-flex align-items-center gap-2 fw-medium ${
              added ? 'btn-amber' : 'btn-teal'
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Agregado
              </>
            ) : (
              <>
                <Plus size={16} /> Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
