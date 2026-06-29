import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Catalog from '../components/Catalog';
import { getHeroImage, mapFlightDto, mapHotelDto, mapTourDto, mapPackageDto } from '../data/productHelpers';
import flightsService from '../services/flightsService';
import hotelsService from '../services/hotelsService';
import toursService from '../services/toursService';
import packagesService from '../services/packagesService';

const categories = [
  { href: '/flights', label: 'Vuelos', desc: 'Tarifas desde $189.000' },
  { href: '/hotels', label: 'Hoteles', desc: 'Estadías seleccionadas' },
  { href: '/tours', label: 'Tours', desc: 'Experiencias locales' },
  { href: '/packages', label: 'Paquetes', desc: 'Todo en uno' },
];

const features = [
  { title: 'Reserva protegida', desc: 'Cancelación flexible y pagos cifrados en cada compra.' },
  { title: 'Curado a mano', desc: 'Cada destino es elegido y probado por nuestro equipo.' },
  { title: 'Soporte 24/7', desc: 'Estamos contigo antes, durante y después del viaje.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      try {
        const [flights, hotels, tours, packagesData] = await Promise.all([
          flightsService.getAll(),
          hotelsService.getAll(),
          toursService.getAll(),
          packagesService.getAll(),
        ]);

        const mapped = [
          ...flights.filter((flight) => flight.isActive).map(mapFlightDto),
          ...hotels.filter((hotel) => hotel.isActive).map(mapHotelDto),
          ...tours.filter((tour) => tour.isActive).map(mapTourDto),
          ...packagesData.filter((pkg) => pkg.isActive).map(mapPackageDto),
        ];

        setProducts(mapped.slice(0, 8));
      } catch (err) {
        setError(err?.message || 'No se pudo cargar las ofertas destacadas.');
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <main>
      <section className="hero-home" style={{ backgroundImage: `linear-gradient(180deg, rgba(18, 82, 74, 0.75), rgba(18, 82, 74, 0.25)), url(${getHeroImage('home')})` }}>
        <div className="hero-home__content">
          <span className="eyebrow">Descubre Colombia y el mundo</span>
          <h1>Tu próximo viaje, sin complicaciones.</h1>
          <p>Vuelos, hoteles, tours y paquetes seleccionados a mano. Reserva en minutos y viaja como siempre soñaste.</p>
          <div className="hero-home__actions">
            <Link to="/#catalog" className="btn btn-primary">
              Explorar ofertas
            </Link>
            <Link to="/packages" className="btn btn-outline">
              Ver paquetes
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Qué buscas hoy</p>
            <h2>Una plataforma, todo tu viaje</h2>
          </div>
          <p>Combina vuelos, alojamiento y experiencias en un solo lugar y ahorra hasta un 30%.</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.href} to={category.href} className="category-card">
              <div className="category-card__label">{category.label}</div>
              <div className="category-card__desc">{category.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="catalog" className="page-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ofertas destacadas</p>
            <h2>Inspírate y reserva</h2>
          </div>
        </div>
        {loading && <p>Cargando ofertas...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && <Catalog products={products} />}
      </section>

      <section className="page-section page-section--highlight">
        <div className="highlight-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
