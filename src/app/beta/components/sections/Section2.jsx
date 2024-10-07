import Link from "next/link";

export default function Section2() {
    return (
        <section className="text-center text-white py-16">
            <h2 className="text-4xl font-bold text-blue-400 mb-4">¿Cómo trabajamos?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-12 px-4">
                Nuestro bot investiga en internet diferentes sitios web de vacantes en Colombia, luego guardamos en base de datos los resultados y te los mostramos :)
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="flex flex-col items-center max-w-xs px-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-full mb-6">
                        <img src="" alt="Icono 1" className="w-12 h-12"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Rastreando vacantes</h3>
                    <p className="text-gray-400 text-center">
                        Nuestro bot "Cabrera" investiga en internet diferentes sitios web de vacantes en Colombia.
                    </p>
                </div>
                <div className="flex flex-col items-center max-w-xs px-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-full mb-6">
                        <img src="" alt="Icono 2" className="w-12 h-12"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Guardando resultados</h3>
                    <p className="text-gray-400 text-center">
                        Guardamos la información recolectada por "Cabrera" y la guardamos en bases de datos.
                    </p>
                </div>
                <div className="flex flex-col items-center max-w-xs px-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-full mb-6">
                        <img src="" alt="Icono 3" className="w-12 h-12"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mostrando resultados</h3>
                    <p className="text-gray-400 text-center">
                        Mostramos los resultados en la página web de Cumbre.
                    </p>
                </div>
            </div>
        </section>
    );
}
