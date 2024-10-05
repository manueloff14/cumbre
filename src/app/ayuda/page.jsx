import Header from '@/components/Header'
import Ayuda from '@/components/pages/ayuda/Ayuda';

export const metadata = {
  title: 'Ayuda | Cumbre',
  description: 'Home page',
}

export default function PageAyuda() {
  return (
    <div>
      <main className="lg:flex lg:justify-between">
        <Header />
        <div className="lg:w-[75%] lg:ml-[25%] p-4">
          <Ayuda />
        </div>
      </main>
    </div>
  );
}
