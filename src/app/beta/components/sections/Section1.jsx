import Link from "next/link"

export default function Section1() {
    return (
        <section className="text-center relative text-white py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-4">
                        Encuentra trabajo rápidamente con Cumbre. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">¡Y fácil!</span>
                    </h1>
                    <p className="text-lg mb-8">
                        Puedes encontrar miles de vacantes en un mismo lugar
                    </p>
                    <div className="flex justify-center items-center gap-4">
                        <Link href="/ayuda">
                            <button className="font-bold bg-gradient-to-r from-blue-500 to-pink-500 py-3 px-8 rounded-full text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 ease-in-out">
                                Buscar vacantes ahora
                            </button>
                        </Link>
                        <Link href="/" className="text-blue-300 hover:underline">
                            ¿Necesitas ayuda?
                        </Link>
                    </div>
                </div>
                {/* Decorative curved element */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                {/* Image section */}
                <div className="mt-16 relative">
                    <img src="https://cdsassets.apple.com/live/7WUAS350/images/macos-sonoma-macbook-pro-safari-web-app-hero.png" alt="Cumbre" className="max-w-full mx-auto"/>
                </div>
            </section>
    )
}