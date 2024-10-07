"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Buscar({ params }) {
    const router = useRouter();
    const [query, setQuery] = useState(params.query || '');
    const [initialResults, setInitialResults] = useState([]);
    const [error, setError] = useState(null);

    // Efecto para obtener los resultados de búsqueda cuando la query cambia
    useEffect(() => {
        if (!params.query) return; // No hacer nada si no hay query

        // Función para obtener los resultados de búsqueda
        const fetchResults = async () => {
            try {
                const response = await fetch(`https://cumbre-server.onrender.com/buscar/${encodeURIComponent(params.query)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setInitialResults(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching results:", err);
                setError("Error al obtener los resultados.");
                setInitialResults([]);
            }
        };

        fetchResults();
    }, [params.query]);

    const handleSearch = () => {
        if (query.trim()) {
            // Cambiar de ruta sin hacer búsqueda inmediata
            router.push(`/beta/search/${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            {/* Mostrar resultados de búsqueda */}
            {error ? (
                <p className="mt-3 text-red-500">{error}</p>
            ) : initialResults.length > 0 ? (
                <div className="p-3">
                    <div>
                        <div className="flex flex-col items-center md:flex-row md:items-center md:gap-5">
                            <Link href="/">
                                <img
                                    src="/img/cumbre_logo.png"
                                    className="w-[120px] mb-6 mt-2 md:my-0"
                                    alt="Logo Cumbre"
                                />
                            </Link>
                            <div className="flex items-center w-[60%] border border-gray-500 rounded-2xl px-2 bg-gray-900">
                                <input
                                    type="text"
                                    placeholder="Buscar algo en la web de empleos..."
                                    className="w-full p-3 mr-2 bg-transparent outline-none"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown} // Detecta el Enter
                                />
                                <button onClick={handleSearch} className="mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 30 30"
                                    >
                                        <path
                                            d="M13 3C7.489 3 3 7.489 3 13c0 5.511 4.489 10 10 10s10-4.489 10-10c0-5.511-4.489-10-10-10zm0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8zm0 1c-4.396 0-8 3.604-8 8s3.604 8 8 8 8-3.604 8-8-3.604-8-8-8zM19.322 20.736L25.293 26.707a1 1 0 1 0 1.414-1.414L20.736 19.322c1.513-1.513 2.279-3.523 2.279-5.736C23 7.489 18.511 3 13 3S3 7.489 3 13s4.489 10 10 10c2.213 0 4.223-.766 5.736-2.279z"
                                            fill="white"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="my-2 md:ml-[140px]">
                            <div className="md:w-[75%] lg:w-[67%]">
                                <span className="text-sm text-gray-500">
                                    Cerca de {initialResults.length} vacantes encontradas
                                </span>

                                <div className="border border-gray-500 rounded-2xl p-2 my-2">
                                    {initialResults.map((resultado) => (
                                        <Link
                                            href={`/empleo/${resultado.id}`}
                                            key={resultado.id}
                                        >
                                            <div
                                                className="p-4 hover:bg-gray-900 rounded-2xl mb-4"
                                            >
                                                <div className="flex gap-3 items-center mb-2">
                                                    <img
                                                        className="p-2 bg-white rounded-2xl w-[35px]"
                                                        src="https://imgs.search.brave.com/YlLL2-CtKMrcSUJdXTJR2SGIIUxx-8c1FciOaGd4Slk/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvMzJjNmY5MjZj/YWNkOGRlZjM0M2Fh/NThjZjdkZWFiMTY1/YmE0MmM2MTFiOWMx/M2UwZTQyYjFhMjBk/NTk0ODc0ZS93d3cu/ZWxlbXBsZW8uY29t/Lw"
                                                        alt="Icono Empleo"
                                                    />
                                                    <div className="flex flex-col">
                                                        <h2 className="text-[16px]">Elempleo</h2>
                                                        <span className="text-xs text-gray-500">
                                                            www.elempleo.com
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold">
                                                        {resultado.title_job}
                                                    </h2>
                                                    <p className="mt-2 text-sm">
                                                        {resultado.miniDescription || "Descripción del trabajo..."}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </>
    );
}
