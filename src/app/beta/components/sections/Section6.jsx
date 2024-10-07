import Link from "next/link"

export default function Section6() {
    return (
        <div className="bg-gray-900 p-8 lg:py-16 lg:px-12 rounded-3xl my-24">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                {/* Sección de texto */}
                <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
                {/* Logo y título */}
                <div className="flex items-center mb-6">
                    <img src="/img/cumbre_logo.png" className='w-[150px] mb-3' alt="" />
                </div>
                {/* Título y descripción */}
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
                    Empieza a encontrar el trabajo de tus sueños con Cumbre :D
                </h3>
                {/* Botones de acción */}
                <div className="flex space-x-4">
                    <button className="text-sm px-4 lg:px-8 py-3 bg-white text-gray-900 font-semibold rounded-full">
                        ¿Por qué Cumbre?
                    </button>
                    <button className="text-sm px-4 lg:px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full">
                        Explora Vacantes
                    </button>
                </div>
                </div>
                {/* Sección de imagen (reemplaza src por tu imagen) */}
                <div className="w-full md:w-1/2">
                <img
                    src="https://via.placeholder.com/200x120"
                    alt="App preview"
                    className="w-full h-auto rounded-lg shadow-lg"
                />
                </div>
            </div>
            </div>
    )
}