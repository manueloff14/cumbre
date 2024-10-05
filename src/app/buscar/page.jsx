import Header from '@/components/Header';
import Buscar from '@/components/pages/buscar/Buscar';
import HeaderMobile from '@/components/HeaderMobile';
import axios from 'axios';

export const metadata = {
  title: 'Buscar Empleos en Colombia: Oportunidades en Todos los Sectores | Cumbre',
  description: 'Busca empleos en Colombia de forma fácil y rápida con Cumbre. Encuentra oportunidades laborales en todos los sectores y ciudades del país. ¡Comienza tu búsqueda y aplica a las mejores vacantes ahora!',
};

export default async function PageBuscar() {
  let categories = [];

  try {
    const response = await axios.get('https://cumbre-server.onrender.com/api/categorias');
    categories = response.data.categories || []; // Use the array from the response
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div>
      <main className="lg:flex lg:justify-between">
        <Header />
        <div className="lg:w-[75%] lg:ml-[25%] p-4">
          <HeaderMobile title="Buscar" />
          <Buscar categorias={categories} />
        </div>
      </main>
    </div>
  );
}
