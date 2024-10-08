"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Cambiar la importación

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter(); // Ahora se usa el router del App Router

    const handleSearch = () => {
        // Redirige a la ruta con la consulta de búsqueda
        if (query.trim()) {
            router.push(`search/${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col text-white">
            {/* Main content centered */}
            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Logo */}
                <div className="mb-8">
                    <img
                        src="/img/cumbre_logo.png"
                        alt="Cumbre Logo"
                        className="w-[160px] mb-4"
                    />
                </div>

                {/* Search Box */}
                <div className="w-full max-w-3xl px-4">
                    <div className="bg-gray-900 rounded-2xl flex items-center shadow-md border-[1px] border-transparent hover:border-[1px] hover:border-gray-600">
                        <input
                            type="text"
                            placeholder="Buscar algo en la web de empleos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // Detecta el Enter
                            className="w-full p-4 bg-transparent outline-none text-white placeholder-gray-400 rounded-full"
                        />
                        <button className="p-3 mx-2" onClick={handleSearch}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="25"
                                height="25"
                                viewBox="0 0 30 30"
                                className="fill-current text-white"
                            >
                                <path
                                    d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Subtitle or Call-to-Action */}
                <p className="mt-6 text-gray-400">
                    Encuentra todas las vacantes de empleo en un sólo lugar.
                </p>
            </div>

            {/* Footer (visible on scroll) */}
            <div className="bg-gray-900 text-gray-400 p-4 text-center shadow-inner">
                © 2024 Cumbre - Todos los derechos reservados
            </div>
        </div>
    );
}
