import React, { useEffect, useState } from 'react';
import CategoryHero from '../components/CategoryHero';
import Catalog from '../components/Catalog';
import packagesService from '../services/packagesService';
import { getHeroImage, mapPackageDto } from '../data/productHelpers';

export default function PackagesPage() {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const data = await packagesService.getAll();
        setPackagesData(data.filter((pkg) => pkg.isActive).map(mapPackageDto));
      } catch (err) {
        setError(err?.message || 'No se pudo cargar los paquetes');
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  return (
    <main>
      <CategoryHero
        eyebrow="Paquetes"
        title="Viajes todo en uno"
        subtitle="Vuelo, hotel y actividades en paquetes diseñados para vacaciones completas."
        image={getHeroImage('packages')}
      />
      <section className="page-section">
        {loading && <p>Cargando paquetes...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Catalog products={packagesData} showTypeFilter={false} initialSort="relevance" />
      </section>
    </main>
  );
}
