import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Compass, Hotel, Headset, Map, Package, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Catalog from '../components/Catalog';
import { getHeroImage, mapFlightDto, mapHotelDto, mapTourDto, mapPackageDto } from '../data/productHelpers';
import flightsService from '../services/flightsService';
import hotelsService from '../services/hotelsService';
import toursService from '../services/toursService';
import packagesService from '../services/packagesService';

const categories = [
  {
    href: '/flights',
    label: 'Vuelos',
    desc: 'Tarifas desde $189.000',
    image: '/images/cartagena.png',
    icon: Plane,
  },
  {
    href: '/hotels',
    label: 'Hoteles',
    desc: 'Estadías seleccionadas',
    image: '/images/hotel-cartagena.png',
    icon: Hotel,
  },
  {
    href: '/tours',
    label: 'Tours',
    desc: 'Experiencias locales',
    image: '/images/tayrona.png',
    icon: Map,
  },
  {
    href: '/packages',
    label: 'Paquetes',
    desc: 'Todo en uno',
    image: '/images/pkg-sanandres.png',
    icon: Package,
  },
];

const features = [
  { icon: ShieldCheck, title: 'Reserva protegida', desc: 'Cancelación flexible y pagos cifrados en cada compra.' },
  { icon: Sparkles, title: 'Curado a mano', desc: 'Cada destino es elegido y probado por nuestro equipo.' },
  { icon: Headset, title: 'Soporte 24/7', desc: 'Estamos contigo antes, durante y después del viaje.' },
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
      <section className="hero-home" style={{ backgroundImage: `linear-gradient(180deg, rgba(18, 82, 74, 0.85), rgba(18, 82, 74, 0.35)), url(${getHeroImage('home')})` }}>
        <div className="hero-home__content">
          <div className="hero-home__badge">
            <Compass className="hero-home__badge-icon" /> Descubre Colombia y el mundo
          </div>
          <h1>Tu próximo viaje, sin complicaciones.</h1>
          <p>Vuelos, hoteles, tours y paquetes seleccionados a mano. Reserva en minutos y viaja como siempre soñaste.</p>

          <div className="hero-home__actions">
            <Link to="/#catalog" className="btn btn-primary">
              Explorar ofertas <ArrowUpRight className="hero-home__action-icon" />
            </Link>
            <Link to="/packages" className="btn btn-outline">
              Ver paquetes
            </Link>
          </div>

          <div className="hero-home__stats">
            <div className="hero-home__stat">
              <strong>150+</strong>
              <span>Destinos</span>
            </div>
            <div className="hero-home__stat">
              <strong>30k</strong>
              <span>Viajeros felices</span>
            </div>
            <div className="hero-home__stat">
              <strong>4.9★</strong>
              <span>Calificación media</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section page-section--wide">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Qué buscas hoy</p>
            <h2>Una plataforma, todo tu viaje</h2>
          </div>
          <p>Combina vuelos, alojamiento y experiencias en un solo lugar y ahorra hasta un 30%.</p>
        </div>

        <div className="category-grid category-grid--featured">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} to={category.href} className="category-card category-card--featured">
                <div className="category-card__image-wrapper">
                  <img src={category.image} alt={category.label} />
                  <div className="category-card__image-overlay" />
                  <span className="category-card__chip">
                    <Icon className="category-card__chip-icon" /> {category.label}
                  </span>
                </div>
                <div className="category-card__body">
                  <p>{category.desc}</p>
                </div>
              </Link>
            );
          })}
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
        <div className="highlight-panel">
          <div className="highlight-panel__content">
            <p className="eyebrow">Por qué Nuvia</p>
            <h2>Viaja con la tranquilidad que mereces</h2>
          </div>
          <div className="highlight-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card feature-card--accent">
                <span className="feature-card__icon">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
