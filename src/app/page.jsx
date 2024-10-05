import { Metadata } from 'next'
import axios from 'axios'
import Header from '@/components/Header'
import HeaderMobile from '@/components/HeaderMobile'
import Categories from '@/components/pages/index/Categories'
import LatestJobs from '@/components/pages/index/LatestJobs'

export const metadata = {
  title: 'Encuentra Empleos en Colombia Rápido y Sin Registro | Cumbre',
  description: 'Cumbre - El buscador de empleo líder en Colombia. Encuentra oportunidades laborales de todo tipo, sin costos ni registros. Consigue tu empleo ideal hoy con vacantes claras y accesibles.',
}

export default async function Home() {
  let latestJobs = [];
  let categories = [];

  try {
    const response = await axios.get('https://cumbre-server.onrender.com/api/home')
    latestJobs = response.data.latestJobs;
    categories = response.data.categories;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

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
