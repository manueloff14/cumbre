"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import CategoryDetail from "./CategoryDetail";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";

export default function CategoryPage() {
    const params = useParams()
    const { categoria } = params

    const categoriaString = categoria.toString()

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
            `https://cumbre-server.onrender.com/categoria/${categoriaString}`
            );
            
            // Convertir la respuesta en un array si no lo es
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setCategoryData(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Error al cargar la categoría.");
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [categoriaString]);

    const capitalize = (str) => {
        // Retornar la palabra en mayuscula la inicial
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        const metaDescription = document.querySelector('meta[name="description"]');
    
        if (loading) {
            document.title = "Cargando Empleos por Categoría | Cumbre";
            if (metaDescription) {
                metaDescription.setAttribute("content", "Buscando empleos por categoría en Colombia. Encuentra la mejor oferta de trabajo con Cumbre.");
            }
        } else if (error) {
            document.title = "Error al Cargar Empleos por Categoría | Cumbre";
            if (metaDescription) {
                metaDescription.setAttribute("content", "Hubo un error al cargar los empleos de esta categoría. Por favor, intenta de nuevo.");
            }
        } else if (categoryData) {
            document.title = `Empleos en ${capitalize(categoriaString)} en Colombia | Cumbre`;
            if (metaDescription) {
                metaDescription.setAttribute("content", `Encuentra las mejores ofertas de trabajo en la categoría ${capitalize(categoriaString)} en Colombia. Descubre oportunidades laborales con Cumbre.`);
            }
        }
    }, [loading, error, categoryData, categoriaString]);    

    if (error) return <div>{error}</div>;
    if (loading || !categoryData) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="flex flex-col justify-center items-center">
                    <img src="/img/cumbre_logo.png" alt="Cumbre Logo" className="w-[150px] mb-5" />
                    <img src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="Cargando página..." className="w-[30px]" />
                </div>
            </div>
        );
    };

    return (
        <div>
            <main className="lg:flex lg:justify-between">
                <Header />
                <div className="lg:w-[75%] lg:ml-[25%] p-4 pb-16 lg:pb-0">
                    <HeaderMobile title="Categoría" />
                    {/* Ahora `categoryData` es un array */}
                    <CategoryDetail data={categoryData} categoria={capitalize(categoriaString)} />
                </div>
            </main>
        </div>
    )
}