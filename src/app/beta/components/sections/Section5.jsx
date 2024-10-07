"use client"

import { useState } from "react";

export default function Section5() {
    // Estado para controlar la pregunta activa
    const [activeIndex, setActiveIndex] = useState(null);

    // Array de preguntas y respuestas
    const faqs = [
        {
            question: "¿Cumbre es gratis?",
            answer: "Cumbre es totalmente gratis. No cobramos ninguna tarifa por buscar ofertas de empleo en la plataforma.",
        },
        {
            question: "¿Necesito registrarme para usar Cumbre?",
            answer: "No es necesario registrarse para buscar vacantes, pero si deseas aplicar a una, se te pedirá crear una cuenta.",
        },
        {
            question: "¿Cómo puedo aplicar a una vacante a través de Cumbre?",
            answer: "Puedes aplicar a una vacante haciendo clic en el botón 'Aplicar' dentro de la descripción del empleo.",
        },
        {
            question: "¿Cumbre almacena mis datos personales?",
            answer: "Sí, Cumbre almacena algunos datos personales necesarios para el proceso de aplicación, pero con total seguridad.",
        },
        {
            question: "¿Qué tipo de empleos puedo encontrar en Cumbre?",
            answer: "Cumbre ofrece una variedad de empleos de distintos sectores como tecnología, finanzas, educación, y muchos más.",
        },
        {
            question: "¿Cumbre verifica las vacantes publicadas?",
            answer: "Sí, nuestro equipo revisa y verifica todas las vacantes antes de publicarlas para asegurar su legitimidad.",
        },
    ];

    // Función para manejar el despliegue/colapso de las respuestas
    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="px-0 py-16 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Título de la sección */}
                <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-400 mb-4">
                    Preguntas frecuentes
                </h2>
                <p className="text-center text-gray-400 mb-8">
                    Descubre las respuestas a tus preguntas frecuentes sobre Cumbre.
                </p>

                {/* Acordeón de preguntas frecuentes */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-4 rounded-lg cursor-pointer"
                            onClick={() => toggleFAQ(index)}
                        >
                            {/* Pregunta */}
                            <div className="flex items-center justify-between text-white">
                                <h3 className="font-semibold">{faq.question}</h3>
                                <span className="text-xl">
                                    {activeIndex === index ? "-" : "+"}
                                </span>
                            </div>
                            {/* Respuesta */}
                            <div
                                className={`text-gray-400 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeIndex === index ? "max-h-40" : "max-h-0"
                                }`}
                            >
                                {activeIndex === index && (
                                    <p className="pt-2">{faq.answer}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
