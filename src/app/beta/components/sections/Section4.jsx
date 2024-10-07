import Link from "next/link"

export default function Section4() {
    return (
        <div className="relative pb-16 pt-0 px-8 text-center text-white">
                <div className="max-w-3xl mx-auto">
                    {/* Testimonio */}
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-400 mb-6">
                        Conectando talento con oportunidades para hacerte la vida más fácil.
                    </h2>
                    {/* Información del autor */}
                    <div className="flex flex-col items-center mb-8">
                    <img
                        src="https://via.placeholder.com/80"
                        alt="Author"
                        className="rounded-full w-16 h-16 mb-2"
                    />
                    <p className="font-semibold">Manuel Cabrera</p>
                    <p className="text-gray-400">Fundador de Cumbre</p>
                    </div>
                    {/* Sección de logos con textos temporales */}
                    <div className="flex flex-wrap justify-center gap-6 text-lg">
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Slack</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Netflix</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Fitbit</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Google</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Airbnb</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg">Uber</span>
                    </div>
                </div>
                {/* Decorative curved element */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
            </div>
    )
}