import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, Headset, Hotel, Map, Package, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import Catalog from '../components/Catalog';
import { getHeroImage, mapFlightDto, mapHotelDto, mapTourDto, mapPackageDto } from '../data/productHelpers';
import flightsService from '../services/flightsService';
import hotelsService from '../services/hotelsService';
import toursService from '../services/toursService';
import packagesService from '../services/packagesService';

const categories = [
  { href: '/flights', label: 'Vuelos', icon: Plane, image: '/images/cartagena.png', desc: 'Tarifas desde $189.000' },
  { href: '/hotels', label: 'Hoteles', icon: Hotel, image: '/images/hotel-cartagena.png', desc: 'Estadías seleccionadas' },
  { href: '/tours', label: 'Tours', icon: Map, image: '/images/tayrona.png', desc: 'Experiencias locales' },
  { href: '/packages', label: 'Paquetes', icon: Package, image: '/images/pkg-sanandres.png', desc: 'Todo en uno' },
];

const features = [
  { icon: ShieldCheck, title: 'Reserva protegida', desc: 'Cancelación flexible y pagos cifrados en cada compra.' },
  { icon: Sparkles, title: 'Curado a mano', desc: 'Cada destino es elegido y probado por nuestro equipo.' },
  { icon: Headset, title: 'Soporte 24/7', desc: 'Estamos contigo antes, durante y después del viaje.' },
];

const stats = [
  { n: '150+', l: 'Destinos' },
  { n: '30k', l: 'Viajeros felices' },
  { n: '4.9★', l: 'Calificación media' },
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
      {/* Hero */}
      <section className="hero">
        <div className="hero-media">
          <img src={getHeroImage('home')} alt="" />
        </div>
        <div className="hero-overlay" />
        <div
          className="container-xl position-relative d-flex flex-column justify-content-end"
          style={{ minHeight: '88vh', paddingTop: '7rem', paddingBottom: '4rem' }}
        >
          <span className="chip text-white align-self-start" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Compass size={16} /> Descubre Colombia y el mundo
          </span>
          <h1
            className="font-heading fw-semibold text-white lh-1 mt-3"
            style={{ maxWidth: '48rem', fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}
          >
            Tu próximo viaje, sin complicaciones.
          </h1>
          <p className="fs-5 text-white-50 mt-3" style={{ maxWidth: '34rem', lineHeight: 1.6 }}>
            Vuelos, hoteles, tours y paquetes seleccionados a mano. Reserva en minutos y viaja como siempre soñaste.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
            <a href="#catalogo" className="btn btn-amber btn-lg rounded-pill d-inline-flex align-items-center gap-2 fw-medium">
              Explorar ofertas <ArrowUpRight size={20} />
            </a>
            <Link to="/packages" className="btn btn-outline-light-nv btn-lg rounded-pill fw-medium">
              Ver paquetes
            </Link>
          </div>

          <div className="row g-4 mt-4 pt-3" style={{ maxWidth: '40rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            {stats.map((s) => (
              <div className="col-4" key={s.l}>
                <div className="font-heading fs-2 fw-semibold text-white">{s.n}</div>
                <div className="small text-white-50">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container-xl py-5 my-lg-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
          <div>
            <p className="text-uppercase-xs text-amber mb-2">Qué buscas hoy</p>
            <h2 className="font-heading fw-semibold lh-sm mb-0" style={{ maxWidth: '28rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Una plataforma, todo tu viaje
            </h2>
          </div>
          <p className="text-muted-nv mb-0" style={{ maxWidth: '24rem' }}>
            Combina vuelos, alojamiento y experiencias en un solo lugar y ahorra hasta un 30%.
          </p>
        </div>

        <div className="row g-4 mt-2">
          {categories.map((c) => (
            <div className="col-12 col-sm-6 col-lg-3" key={c.href}>
              <Link to={c.href} className="category-card">
                <img src={c.image} alt={c.label} />
                <div className="category-overlay" />
                <div className="position-absolute bottom-0 start-0 p-4">
                  <span
                    className="icon-circle text-white"
                    style={{ width: '2.75rem', height: '2.75rem', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <c.icon size={20} />
                  </span>
                  <h3 className="font-heading fs-3 fw-semibold mt-3 mb-0">{c.label}</h3>
                  <p className="small text-white-50 mb-0">{c.desc}</p>
                </div>
                <ArrowUpRight size={20} className="position-absolute text-white" style={{ top: '1.5rem', right: '1.5rem' }} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="container-xl pb-4" style={{ scrollMarginTop: '6rem' }}>
        <div className="mb-4">
          <p className="text-uppercase-xs text-amber mb-2">Ofertas destacadas</p>
          <h2 className="font-heading fw-semibold lh-sm mb-0" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Inspírate y reserva
          </h2>
        </div>
        {loading && <p className="text-muted-nv">Cargando ofertas...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && <Catalog products={products} />}
      </section>

      {/* Por qué Nuvia */}
      <section className="container-xl py-5 my-lg-4">
        <div className="bg-teal text-white p-4 p-md-5 rounded-4xl">
          <div style={{ maxWidth: '36rem' }}>
            <p className="text-uppercase-xs text-amber mb-2">Por qué Nuvia</p>
            <h2 className="font-heading fw-semibold lh-sm mb-0" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Viaja con la tranquilidad que mereces
            </h2>
          </div>
          <div className="row g-4 mt-3">
            {features.map((f) => (
              <div className="col-12 col-md-4" key={f.title}>
                <div className="h-100 p-4 rounded-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="icon-circle bg-amber text-white" style={{ width: '3rem', height: '3rem' }}>
                    <f.icon size={24} />
                  </span>
                  <h3 className="font-heading fs-4 fw-semibold mt-3">{f.title}</h3>
                  <p className="text-white-50 mb-0" style={{ lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
