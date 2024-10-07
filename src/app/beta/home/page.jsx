import Image from 'next/image'
import Header from '../components/Header';
import Section1 from '../components/sections/Section1';
import Section2 from '../components/sections/Section2';
import Section3 from '../components/sections/Section3';
import Section4 from '../components/sections/Section4';
import Section5 from '../components/sections/Section5';
import Section6 from '../components/sections/Section6';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Encuentra Empleos en Colombia | Cumbre',
    description: 'Encuentra más de 100 mil trabajos recientes en Colombia. Descubre tu empleo ideal con las últimas oportunidades laborales.',
};

export default function Home() {
    return (
        <div className="p-4 lg:py-4 lg:px-16">
            <Header />

            <Section1 />

            <Section2 />

            <Section3 />

            <Section4 />

            <Section5 />

            <Section6 />

            <Footer />
        </div>
    );
}
