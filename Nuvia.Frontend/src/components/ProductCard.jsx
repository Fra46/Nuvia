import React, { useState } from 'react';
import { Check, MapPin, Plus, Star } from 'lucide-react';
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
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <MapPin className="h-4 w-4" /> {product.location}
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <div>
            <span className="product-card__price">{formatCOP(product.price)}</span>
            <div className="product-card__rating">
              <Star className="h-4 w-4" /> {product.rating}
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            {added ? (
              <>
                <Check className="h-4 w-4" /> Agregado
              </>
            ) : (
              <>Agregar</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
