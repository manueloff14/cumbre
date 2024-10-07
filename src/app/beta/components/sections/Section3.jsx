import Link from "next/link"

export default function Section3() {
    return (
        <section class="text-center text-white py-16">
                <div class="max-w-6xl mx-auto px-6">
                    <span class="font-bold text-black bg-white p-3 px-6 rounded-full text-xs">Features</span>
                    <h2 class="text-4xl font-bold text-blue-400 mt-10 mb-5">
                        Miles de oportunidades, un solo lugar.
                    </h2>
                    <p className='text-gray-500 text-sm mb-10'>Con Cumbre, encontrar el empleo perfecto es rápido, fácil y seguro. Explora todas nuestras funciones diseñadas para ayudarte en tu búsqueda laboral.</p>
                    <div class="flex flex-wrap justify-center gap-4 mb-14 text-sm">
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Rápido</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Confiable</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Actualizado</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Multisectorial</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Seguridad</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Soporte 24/7</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Resultados precisos</button>
                        <button class="bg-gray-900 hover:bg-gray-800 hover:text-white hover:border hover:border-white border border-transparent text-gray-500 py-2 px-4 rounded-lg transition-all duration-200">Gratis</button>
                    </div>
                </div>
            </section>
    )
}