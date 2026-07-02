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
        title="Paquetes de viaje"
        subtitle="Combina vuelos, hoteles y tours en un solo lugar y ahorra hasta un 30%."
        image={getHeroImage('packages')}
      />
      <section className="container-xl py-5">
        {loading && <p className="text-muted-nv">Cargando paquetes...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && <Catalog products={packagesData} showTypeFilter={false} />}
      </section>
    </main>
  );
}
