"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Buscar({ categorias = [] }) {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultados, setResultados] = useState([]);

    // useEffect para hacer la petición cuando el inputValue cambia
    useEffect(() => {
        const fetchResults = async () => {
            if (inputValue.trim() === "") {
                // Si el input está vacío, no buscar
                setResultados([]);
                return;
            }
            
            setLoading(true);

            try {
                // Petición a la API
                const response = await fetch(`https://cumbre-server.onrender.com/buscar/${inputValue}`);
                const data = await response.json();
                
                // Actualizar resultados
                setResultados(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [inputValue]);

    // Función para limpiar el input y mostrar categorías
    const handleClear = () => {
        setInputValue("");
        setResultados([]);
    };

    return (
        <div className="mt-3">
            <div className="bg-white rounded-xl flex items-center p-3">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                    <path d="M 20.5 6 C 12.509634 6 6 12.50964 6 20.5 C 6 28.49036 12.509634 35 20.5 35 C 23.956359 35 27.133709 33.779044 29.628906 31.75 L 39.439453 41.560547 A 1.50015 1.50015 0 1 0 41.560547 39.439453 L 31.75 29.628906 C 33.779044 27.133709 35 23.956357 35 20.5 C 35 12.50964 28.490366 6 20.5 6 z M 20.5 9 C 26.869047 9 32 14.130957 32 20.5 C 32 23.602612 30.776198 26.405717 28.791016 28.470703 A 1.50015 1.50015 0 0 0 28.470703 28.791016 C 26.405717 30.776199 23.602614 32 20.5 32 C 14.130953 32 9 26.869043 9 20.5 C 9 14.130957 14.130953 9 20.5 9 z"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar en Cumbre"
                    className="ml-2 text-black w-full outline-none text-sm"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            {/* Mostrar resultados de búsqueda */}
            {loading ? (
                <p className="mt-3">Cargando...</p>
            ) : resultados.length > 0 ? (
                <div className="mt-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">Resultados</h2>
                        <button
                            className="mb-2 text-white bg-red-500 px-2 py-1 rounded"
                            onClick={handleClear}
                        >
                            Cerrar
                        </button>
                    </div>
                    <div>
                        {resultados.map((resultado, index) => (
                            <Link href={`/empleo/${resultado.id}`} >
                                <div key={index} className="p-3 bg-gray-800 mt-1 rounded-2xl">
                                    {resultado.title}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                // Mostrar categorías si no hay resultados y el input está vacío
                inputValue.trim() === "" && (
                    <div className="grid gap-2 mt-3 grid-cols-1 text-sm lg:grid-cols-2">
                        {categorias.length > 0 ? (
                            categorias.map((categoria, index) => (
                                <div
                                    className="p-3 bg-gray-800 border-2 border-white rounded-lg"
                                    key={index}
                                >
                                    {categoria}
                                </div>
                            ))
                        ) : (
                            <p>No categories available</p>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
