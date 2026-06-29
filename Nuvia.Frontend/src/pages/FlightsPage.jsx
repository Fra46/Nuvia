import React, { useEffect, useState } from 'react';
import CategoryHero from '../components/CategoryHero';
import Catalog from '../components/Catalog';
import flightsService from '../services/flightsService';
import { getHeroImage, mapFlightDto } from '../data/productHelpers';

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        const data = await flightsService.getAll();
        setFlights(data.filter((flight) => flight.isActive).map(mapFlightDto));
      } catch (err) {
        setError(err?.message || 'No se pudo cargar los vuelos');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  return (
    <main>
      <CategoryHero
        eyebrow="Vuelos"
        title="Encuentra vuelos económicos"
        subtitle="Los mejores precios nacionales e internacionales, sin cargos ocultos."
        image={getHeroImage('flights')}
      />
      <section className="page-section">
        {loading && <p>Cargando vuelos...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Catalog products={flights} showTypeFilter={false} initialSort="price-asc" />
      </section>
    </main>
  );
}
