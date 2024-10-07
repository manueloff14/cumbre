export default function Footer() {
    return (
        <footer className="mt-10 mb-4 text-gray-400">
                <div className="max-w-6xl mx-auto">
                    {/* Sección de suscripción */}
                    <div className="text-center mb-8">
                    <h2 className="text-white text-2xl md:text-3xl font-semibold mb-4">Suscríbete a Nuestro Boletín Diario</h2>
                    <p className="text-gray-400 mb-6">Recibe ofertas de empleo y consejos para tu carrera en tu correo.</p>
                    <div className="flex justify-center">
                        <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="px-4 py-3 w-full lg:w-auto rounded-l-full text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-r-full font-semibold">
                            Suscribirme
                        </button>
                    </div>
                    </div>

                    {/* Línea divisora */}
                    <hr className="my-8 border-gray-700" />

                    {/* Navegación y logo */}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo y nombre */}
                    <div className="mb-6 md:mb-0">
                        <img src="/img/cumbre_logo.png" className="w-[120px]" alt="" />
                    </div>
                    
                    {/* Menú de navegación */}
                    <ul className="flex flex-wrap justify-center gap-6 text-lg mb-6 md:mb-0">
                        <li><a href="#" className="hover:text-white">Inicio</a></li>
                        <li><a href="#" className="hover:text-white">Servicios</a></li>
                        <li><a href="#" className="hover:text-white">Nosotros</a></li>
                        <li><a href="#" className="hover:text-white">Contacto</a></li>
                    </ul>
                    </div>

                    {/* Línea divisora */}
                    <hr className="my-8 border-gray-700" />

                    {/* Copyright */}
                    <div className="text-center">
                    <p>&copy; {new Date().getFullYear()} Cumbre. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
    )
}