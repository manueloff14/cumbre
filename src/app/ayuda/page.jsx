import Header from '@/components/Header'
import Ayuda from '@/components/pages/ayuda/Ayuda';

export const metadata = {
  title: 'Ayuda y Preguntas Frecuentes para Encontrar Empleo en Colombia | Cumbre',
  description: '¿Dudas sobre cómo encontrar empleo en Colombia con Cumbre? Explora nuestras preguntas frecuentes y obtén ayuda para aplicar a cientos de vacantes seguras y accesibles. ¡Descubre lo fácil que es encontrar tu trabajo ideal!',
}

export default function PageAyuda() {
  return (
    <div>
      <main className="lg:flex lg:justify-between">
        <Header />
        <div className="lg:w-[75%] lg:ml-[25%] p-4 pb-20 lg:pb-4">
          <Ayuda />
        </div>
      </main>
    </div>
  );
}
