"use client";

import { useState } from 'react';

export default function Ayuda() {
  // Estado para almacenar qué preguntas están abiertas
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="lg:flex lg:items-center lg:justify-between lg:my-10">
        <div className="text-center my-10 lg:w-[50%]">
          <h1 className="font-bold text-3xl mb-2">Acerca de Cumbre</h1>
          <p className="text-sm mb-3">
            Cumbre te facilita la búsqueda de empleo con vacantes claras y accesibles.
          </p>
          <a href="#" className="hidden text-sm">
            <button className="bg-white text-black font-bold p-2 px-4 rounded-xl">
              más
            </button>
          </a>
        </div>
        <div className="w-full flex justify-center mb-10 lg:w-[50%] lg:mb-0">
          <img className="w-[70%] lg:w-full rounded-3xl" src="/img/mock-cumbre-inicio.png" alt="Cumbre inicio" />
        </div>
      </section>

      <section className="my-10">
        <h2 className="font-bold text-xl mb-5">Preguntas frecuentes</h2>
        <ul>
          {faqData.map((faq, index) => (
            <li key={index}>
              <button
                className="toggle-btn w-full text-left p-3 border border-gray-300 rounded-xl font-medium mb-2"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
              </button>
              <p className={`answer ${openIndex === index ? 'block' : 'hidden'} p-3 pl-5`}>
                {faq.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="my-5">
        <h2 className="font-bold text-xl mb-2">¿Deseas contactarnos?</h2>
        <h3 className="font-semibold">Sólo atenderemos solicitudes sobre:</h3>
        <ul className="text-sm my-5">
          <li>- Mejoras en el servicio</li>
          <li>- Errores ocasionales</li>
          <li>- Contacto empresarial</li>
        </ul>
        <form className="flex flex-col items-center text-black">
          <input type="text" placeholder="Nombre" className="w-full p-3 rounded-xl mb-3" />
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl mb-3" />
          <textarea
            className="w-full h-[150px] p-3 rounded-xl mb-3"
            placeholder="Escribe tu contacto"
          ></textarea>
          <button className="bg-gray-900 w-full p-3 font-bold text-white text-sm rounded-xl">
            Continuar
          </button>
        </form>
      </section>

      <div className="w-full p-3 text-center text-sm">
          <span>© <a href="https://www.cumbre.icu" target="_blank" rel="noopener noreferrer" className="font-bold">Cumbre.icu</a>, fundada por <a href="https://github.com/manueloff14" target="_blank" rel="noopener noreferrer" className='font-bold'>Manuel Cabrera</a></span>
      </div>
    </>
  );
}

const faqData = [
  {
    question: "¿Cumbre es gratis?",
    answer: "Sí, Cumbre es totalmente gratis."
  },
  {
    question: "¿Necesito registrarme para usar Cumbre?",
    answer: "No, no necesitas registrarte ni proporcionar datos personales para ver las vacantes. Simplemente entra en Cumbre.icu y comienza a buscar tu empleo ideal."
  },
  {
    question: "¿Cómo puedo aplicar a una vacante que encuentro en Cumbre?",
    answer: "Cumbre actúa como intermediario. Cuando encuentres una vacante que te interese, haz clic en \"Aplicar ahora\" y serás redirigido al sitio web original donde está publicada la oferta para que completes el proceso de postulación."
  },
  {
    question: "¿Cumbre almacena mis datos personales?",
    answer: "No, Cumbre no solicita ni almacena ningún dato personal. Puedes navegar y buscar empleos sin registrarte ni compartir información personal."
  },
  {
    question: "¿Qué tipo de empleos puedo encontrar en Cumbre?",
    answer: "En Cumbre puedes encontrar una amplia variedad de empleos en diferentes sectores como tecnología, administración, salud, entre otros, a nivel nacional en Colombia."
  },
  {
    question: "¿Cumbre verifica las vacantes publicadas?",
    answer: "Cumbre recopila e indexa las vacantes de diversas fuentes en línea, pero no se encarga de verificar directamente las ofertas. Te recomendamos siempre revisar los detalles en el sitio web oficial de la oferta."
  }
];
