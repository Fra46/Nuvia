import React, { useEffect, useState } from 'react';
import CategoryHero from '../components/CategoryHero';
import Catalog from '../components/Catalog';
import hotelsService from '../services/hotelsService';
import { getHeroImage, mapHotelDto } from '../data/productHelpers';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        const data = await hotelsService.getAll();
        setHotels(data.filter((hotel) => hotel.isActive).map(mapHotelDto));
      } catch (err) {
        setError(err?.message || 'No se pudo cargar los hoteles');
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  return (
    <main>
      <CategoryHero
        eyebrow="Hoteles"
        title="Hospedajes con estilo"
        subtitle="Encuentra hoteles boutique, resorts y estancias con experiencia personalizada."
        image={getHeroImage('hotels')}
      />
      <section className="page-section">
        {loading && <p>Cargando hoteles...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Catalog products={hotels} showTypeFilter={false} initialSort="rating" />
      </section>
    </main>
  );
}
