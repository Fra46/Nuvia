import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categoryLabels, formatCOP } from '../data/productHelpers';

export default function CartPage() {
  const { items, subtotal, iva, total, setQuantity, remove, clear, loading } = useCart();

  return (
    <main className="container-xl pb-5" style={{ paddingTop: '7rem' }}>
      <Link to="/" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Seguir explorando
      </Link>

      <h1 className="font-heading fw-semibold lh-sm mt-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        Tu carrito
      </h1>

      {loading ? (
        <div className="nv-card d-flex flex-column align-items-center justify-content-center text-center py-5 mt-4">
          <span className="icon-circle bg-sand text-teal" style={{ width: '4rem', height: '4rem' }}>
            <ShoppingBag size={32} />
          </span>
          <h2 className="font-heading fs-3 fw-semibold mt-4">Cargando carrito...</h2>
          <p className="text-muted-nv">Un momento, estamos consultando tu carrito.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="nv-card d-flex flex-column align-items-center justify-content-center text-center py-5 mt-4">
          <span className="icon-circle bg-sand text-teal" style={{ width: '4rem', height: '4rem' }}>
            <ShoppingBag size={32} />
          </span>
          <h2 className="font-heading fs-3 fw-semibold mt-4">Tu carrito está vacío</h2>
          <p className="text-muted-nv">Explora nuestras experiencias y empieza a planear tu viaje.</p>
          <Link to="/packages" className="btn btn-teal rounded-pill px-4 mt-2">
            Ver paquetes
          </Link>
        </div>
      ) : (
        <div className="row g-4 mt-2 align-items-start">
          {/* Items */}
          <div className="col-12 col-lg-8">
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
              {items.map((item) => (
                <li key={item.id} className="nv-card p-3">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                    <div
                      className="position-relative flex-shrink-0 rounded-3 overflow-hidden w-100"
                      style={{ height: '7rem', maxWidth: '9rem' }}
                    >
                      <img src={item.image} alt={item.name} className="img-cover" />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <span className="text-uppercase-xs text-amber">{categoryLabels[item.category]}</span>
                      <h3 className="font-heading fs-5 fw-semibold lh-sm mb-0">{item.name}</h3>
                      <p className="small text-muted-nv mb-1">{item.location}</p>
                      <p className="small fw-medium mb-0">{formatCOP(item.price)} c/u</p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 flex-sm-column align-items-sm-end">
                      <div className="d-flex align-items-center border border-nv rounded-pill">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: '2.25rem', height: '2.25rem' }}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-center fw-semibold" style={{ width: '2rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: '2.25rem', height: '2.25rem' }}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="font-heading fs-5 fw-semibold">{formatCOP(item.price * item.quantity)}</span>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="btn btn-sm text-muted-nv rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: '2.25rem', height: '2.25rem' }}
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" onClick={clear} className="btn btn-link text-muted-nv text-decoration-none small mt-3 px-0">
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="col-12 col-lg-4">
            <aside className="nv-card p-4 position-sticky" style={{ top: '6rem' }}>
              <h2 className="font-heading fs-4 fw-semibold">Resumen</h2>
              <dl className="mt-3 mb-0">
                <div className="d-flex justify-content-between mb-2">
                  <dt className="fw-normal text-muted-nv">Subtotal</dt>
                  <dd className="fw-medium mb-0">{formatCOP(subtotal)}</dd>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <dt className="fw-normal text-muted-nv">IVA (19%)</dt>
                  <dd className="fw-medium mb-0">{formatCOP(iva)}</dd>
                </div>
                <div className="d-flex justify-content-between pt-3 mt-2 border-top border-nv">
                  <dt className="font-heading fs-5 fw-semibold">Total</dt>
                  <dd className="font-heading fs-5 fw-semibold text-teal mb-0">{formatCOP(total)}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn-teal rounded-pill w-100 py-2 mt-4">
                Proceder al pago
              </button>
              <p className="text-center small text-muted-nv mt-3 mb-0">Pago seguro · Cancelación flexible</p>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}
