import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { getStoredFavorites } from '../utils/favorites';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const refresh = () => setFavorites(getStoredFavorites());
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  return (
    <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
      <Link to="/profile" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver al perfil
      </Link>

      <div className="nv-card p-4 p-md-5 mt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <p className="text-uppercase-xs text-amber mb-2">Tus favoritos</p>
            <h1 className="font-heading fw-semibold lh-sm mb-0">Guardaste estas experiencias para más tarde</h1>
          </div>
          <div className="d-inline-flex align-items-center gap-2 rounded-pill border border-nv px-3 py-2 text-muted-nv">
            <Heart size={16} />
            <span>{favorites.length} guardados</span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="d-flex flex-column align-items-center text-center py-5 mt-4">
            <div className="icon-circle bg-sand text-teal" style={{ width: '3.5rem', height: '3.5rem' }}>
              <Sparkles size={24} />
            </div>
            <h2 className="font-heading fs-4 fw-semibold mt-3">Aún no tienes favoritos</h2>
            <p className="text-muted-nv mb-0">Marca tus experiencias favoritas desde cualquier tarjeta para verlas aquí.</p>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {favorites.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                <ProductCard product={{ ...product, rating: 4.8, reviews: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
