"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {

    const [movil, setMovil] = useState(false)

    // Función para mostrar y ocultar el menú móvil
    const mostrarMenu = () => {
        setMovil(!movil) // Cambia el estado de `movil`
    }

    return (
        <header className="font-bold flex items-center justify-between text-sm">
            <div className="flex flex-grow basis-0">
                <Link href="/">
                    <img src="/img/cumbre_logo.png" className="w-[150px]" alt="" />
                </Link>
            </div>
            {/* Menú de escritorio */}
            <span className="hidden lg:block">
                <ul className="flex gap-6">
                    <li>Inicio</li>
                    <li>Servicios</li>
                    <li>Nosotros</li>
                    <li>Contacto</li>
                </ul>
            </span>
            <div className="hidden lg:flex flex-grow justify-end basis-0">
                <Link href="/ayuda">
                    <button className="bg-gradient-to-r from-blue-500 to-pink-500 py-3 px-6 rounded-full text-white border-2 border-gray-900 hover:border-white transition-all duration-300 ease-in-out">
                        Empezar ahora
                    </button>
                </Link>
            </div>
            {/* Botón de menú móvil */}
            <button className="p-2 ml-4 lg:hidden" onClick={mostrarMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                    <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z" fill="white"></path>
                </svg>
            </button>
            {/* Menú móvil */}
            {movil && (
                <div className="fixed top-0 right-0 z-[1000] bg-gray-800 text-white w-full h-full p-4 lg:hidden">
                    <div className="w-full flex justify-between">
                        <Link href="/">
                            <img src="/img/cumbre_logo.png" className="w-[150px]" alt="" />
                        </Link>
                        <button className="p-2 ml-4 lg:hidden" onClick={mostrarMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 64 64">
                                <path d="M 16 14 C 15.488 14 14.976938 14.194937 14.585938 14.585938 C 13.804937 15.366937 13.804937 16.633063 14.585938 17.414062 L 29.171875 32 L 14.585938 46.585938 C 13.804938 47.366938 13.804937 48.633063 14.585938 49.414062 C 14.976937 49.805062 15.488 50 16 50 C 16.512 50 17.023062 49.805062 17.414062 49.414062 L 32 34.828125 L 46.585938 49.414062 C 47.366938 50.195063 48.633063 50.195062 49.414062 49.414062 C 50.195063 48.633062 50.195062 47.366937 49.414062 46.585938 L 34.828125 32 L 49.414062 17.414062 C 50.195063 16.633063 50.195062 15.366938 49.414062 14.585938 C 48.633062 13.804938 47.366937 13.804938 46.585938 14.585938 L 32 29.171875 L 17.414062 14.585938 C 17.023062 14.194938 16.512 14 16 14 z" fill="white"></path>
                            </svg>
                        </button>
                    </div>
                    <ul className="flex flex-col items-center gap-7 text-3xl h-full justify-center">
                        <li>Inicio</li>
                        <li>Servicios</li>
                        <li>Nosotros</li>
                        <li>Contacto</li>
                    </ul>
                </div>
            )}
        </header>
    )
}
