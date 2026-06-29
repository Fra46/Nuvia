import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP, categoryLabels } from '../data/products';

export default function CartPage() {
  const { items, subtotal, iva, total, setQuantity, remove, clear, loading } = useCart();

  return (
    <main className="page-section">
      <div className="cart-page">
        <Link to="/" className="cart-page__back">
          <ArrowLeft className="h-4 w-4" /> Seguir explorando
        </Link>

        <h1>Tu carrito</h1>

        {loading ? (
          <div className="cart-page__empty">
            <ShoppingBag className="h-10 w-10" />
            <h2>Cargando carrito...</h2>
            <p>Un momento, estamos consultando tu carrito.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-page__empty">
            <ShoppingBag className="h-10 w-10" />
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestras experiencias y empieza a planear tu viaje.</p>
            <Link to="/packages" className="btn btn-primary">
              Ver paquetes
            </Link>
          </div>
        ) : (
          <div className="cart-page__grid">
            <ul className="cart-page__items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item__content">
                    <span>{categoryLabels[item.category]}</span>
                    <h3>{item.name}</h3>
                    <p>{item.location}</p>
                    <strong>{formatCOP(item.price)} c/u</strong>
                  </div>
                  <div className="cart-item__actions">
                    <div className="quantity-control">
                      <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button type="button" onClick={() => remove(item.id)} className="btn btn-ghost">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
              <li className="cart-page__clear">
                <button type="button" className="btn btn-ghost" onClick={clear}>
                  Vaciar carrito
                </button>
              </li>
            </ul>

            <aside className="cart-summary">
              <h2>Resumen</h2>
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <strong>{formatCOP(subtotal)}</strong>
              </div>
              <div className="cart-summary__row">
                <span>IVA (19%)</span>
                <strong>{formatCOP(iva)}</strong>
              </div>
              <div className="cart-summary__row cart-summary__total">
                <span>Total</span>
                <strong>{formatCOP(total)}</strong>
              </div>
              <button type="button" className="btn btn-primary">
                Proceder al pago
              </button>
              <p className="cart-summary__hint">Pago seguro · Cancelación flexible</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
