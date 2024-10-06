"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Buscar from '@/components/pages/buscar/Buscar';
import HeaderMobile from '@/components/HeaderMobile';
import axios from 'axios';

export default function PageBuscar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener categorías
    const fetchCategories = async () => {
      setLoading(true); // Inicia la carga
      setError(null); // Resetea el error
      try {
        const response = await axios.get('https://cumbre-server.onrender.com/api/categorias');
        setCategories(response.data.categories || []);

        // Actualizar el título y la meta descripción después de obtener las categorías exitosamente
        document.title = 'Buscar Empleos en Colombia: Oportunidades en Todos los Sectores | Cumbre';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            'content',
            'Busca empleos en Colombia de forma fácil y rápida con Cumbre. Encuentra oportunidades laborales en todos los sectores y ciudades del país. ¡Comienza tu búsqueda y aplica a las mejores vacantes ahora!'
          );
        } else {
          // Si la meta descripción no existe, se crea y se agrega al head
          const newMeta = document.createElement('meta');
          newMeta.name = 'description';
          newMeta.content =
            'Busca empleos en Colombia de forma fácil y rápida con Cumbre. Encuentra oportunidades laborales en todos los sectores y ciudades del país. ¡Comienza tu búsqueda y aplica a las mejores vacantes ahora!';
          document.head.appendChild(newMeta);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Hubo un error al cargar las categorías.');
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchCategories(); // Llama a la función para obtener las categorías
  }, []);

  return (
    <div>
      <main className="lg:flex lg:justify-between">
        <Header />
        <div className="lg:w-[75%] lg:ml-[25%] p-4">
          <HeaderMobile title="Buscar" />

          {/* Mostrar mensaje de carga */}
          {loading && <p>Cargando categorías...</p>}

          {/* Mostrar mensaje de error si ocurre */}
          {error && <p>{error}</p>}

          {/* Mostrar componente Buscar solo si hay categorías y no está cargando */}
          {!loading && !error && <Buscar categorias={categories} />}
        </div>
      </main>
    </div>
  );
}
