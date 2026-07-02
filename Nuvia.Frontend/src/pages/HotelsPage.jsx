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
        title="Hoteles confortables"
        subtitle="Estadías boutique y resorts frente al mar con descuentos exclusivos."
        image={getHeroImage('hotels')}
      />
      <section className="container-xl py-5">
        {loading && <p className="text-muted-nv">Cargando hoteles...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && <Catalog products={hotels} showTypeFilter={false} />}
      </section>
    </main>
  );
}
