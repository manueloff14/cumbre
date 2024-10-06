"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import HeaderMobile from '@/components/HeaderMobile';
import Categories from '@/components/pages/index/Categories';
import LatestJobs from '@/components/pages/index/LatestJobs';

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cumbre-server.onrender.com/api/home');
        setLatestJobs(response.data.latestJobs);
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Hubo un problema al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Efecto para actualizar el título y la meta descripción una vez cargada la data
  useEffect(() => {
    if (!loading && !error) {
      // Actualizar el título de la página
      document.title = `Encuentra Empleos en Colombia | ${categories.length} categorías disponibles`;

      // Actualizar la meta descripción
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Encuentra ${latestJobs.length} trabajos recientes en Colombia. Descubre tu empleo ideal con las últimas oportunidades laborales.`);
      } else {
        const newMetaDescription = document.createElement('meta');
        newMetaDescription.name = 'description';
        newMetaDescription.content = `Encuentra ${latestJobs.length} trabajos recientes en Colombia. Descubre tu empleo ideal con las últimas oportunidades laborales.`;
        document.head.appendChild(newMetaDescription);
      }
    }
  }, [loading, error, categories, latestJobs]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <main className="lg:flex lg:justify-between">
        <Header />
        <div className="lg:w-[75%] lg:ml-[25%] p-4">
          <HeaderMobile title="Inicio" />
          <div>
            <h2 className="text-lg font-bold my-3">Algunas categorías populares</h2>
            <Categories categories={categories} />
          </div>
          <div className="mb-[70px] lg:mb-0">
            <h2 className="font-bold text-lg my-4">Trabajos recién agregados</h2>
            <div>
              <LatestJobs latestJobs={latestJobs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
