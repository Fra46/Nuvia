import React, { useState } from 'react';
import { Check, Clock, MapPin, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP, categoryLabels } from '../data/products';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="product-card">
      <div className="product-card__image" role="img" aria-label={product.name}>
        <img src={product.image} alt={product.name} />
        <span className="product-card__badge">{categoryLabels[product.category]}</span>
        <span className="product-card__rating-bubble">
          <Star className="h-4 w-4" /> {product.rating}
        </span>
      </div>
      <div className="product-card__body">
        <div className="product-card__meta-row">
          <div className="product-card__meta">
            <MapPin className="h-4 w-4" /> {product.location}
          </div>
          {product.meta && (
            <div className="product-card__meta">
              <Clock className="h-4 w-4" /> {product.meta}
            </div>
          )}
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-card__tags">
          {product.features?.slice(0, 3).map((feature) => (
            <span key={feature} className="product-card__tag">
              {feature}
            </span>
          ))}
        </div>

        <div className="product-card__footer">
          <div>
            <span className="product-card__price">{formatCOP(product.price)}</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            {added ? (
              <>
                <Check className="h-4 w-4" /> Agregado
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
