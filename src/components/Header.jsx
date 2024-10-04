"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    const pathname = usePathname();

    const homeImageSrc = pathname === "/" ? "/img/homeClick.svg" : "/img/homeNoClick.svg";
    const searchImageSrc = pathname === "/buscar" ? "/img/searchClick.svg" : "/img/searchNoClick.svg";

    return (
        <header className="fixed bottom-0 left-0 w-full bg-gray-900 text-[11px] p-2 lg:fixed lg:w-[25%] lg:h-screen lg:text-[16px]">
        <Link href="/" className="hidden lg:block lg:w-full mb-5">
            <li
            className="flex flex-col items-center lg:flex-row lg:w-full lg:p-2 lg:rounded-xl"
            title="Logo de Cumbre"
            >
            {/* Usa next/image para optimizar la carga de imágenes */}
            <Image
                src="/img/cumbre_logo.png"
                alt="Logo Cumbre"
                width={150}
                height={150}
                className="w-[150px]"
                priority // Esto hará que la imagen se cargue con mayor prioridad
            />
            </li>
        </Link>
        <ul className="flex justify-around items-center lg:flex-col">
            {/* Home Link */}
            <li className="lg:w-full">
            <Link
                href="/"
                className="flex flex-col items-center lg:flex-row lg:w-full lg:p-2 lg:px-5 lg:rounded-xl"
                id="btnInicio"
            >
                <Image
                src={homeImageSrc}
                alt="Logo Cumbre"
                width={25}
                height={25}
                priority // Esto hará que la imagen se cargue con mayor prioridad
                />
                <span className="mt-[3px] lg:ml-2"> Inicio </span>
            </Link>
            </li>

            {/* Search Link */}
            <li className="lg:w-full">
            <Link
                href="/buscar"
                className="flex flex-col items-center lg:flex-row lg:w-full lg:p-2 lg:px-5 lg:rounded-xl"
                id="btnBuscar"
            >
                <Image
                src={searchImageSrc}
                alt="Logo Cumbre"
                width={25}
                height={25}
                priority // Esto hará que la imagen se cargue con mayor prioridad
                />
                <span className="mt-[3px] lg:ml-2"> Buscar </span>
            </Link>
            </li>
        </ul>
        </header>
    );
}