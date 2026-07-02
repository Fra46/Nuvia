import React, { useEffect, useState } from 'react';
import CategoryHero from '../components/CategoryHero';
import Catalog from '../components/Catalog';
import toursService from '../services/toursService';
import { getHeroImage, mapTourDto } from '../data/productHelpers';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);
      try {
        const data = await toursService.getAll();
        setTours(data.filter((tour) => tour.isActive).map(mapTourDto));
      } catch (err) {
        setError(err?.message || 'No se pudo cargar los tours');
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  return (
    <main>
      <CategoryHero
        eyebrow="Tours"
        title="Tours inolvidables"
        subtitle="Explora y descubre experiencias únicas guiadas por expertos locales."
        image={getHeroImage('tours')}
      />
      <section className="container-xl py-5">
        {loading && <p className="text-muted-nv">Cargando tours...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && <Catalog products={tours} showTypeFilter={false} />}
      </section>
    </main>
  );
}
