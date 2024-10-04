import Link from "next/link";

export default function Categories({categories}) {
    // Función para transformar el texto, eliminando acentos y convirtiendo a minúsculas
    function slugify(text) {
        return text
            .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
            .toLowerCase() // Convierte todo a minúsculas
            .replace(/\s+/g, "-"); // Reemplaza los espacios por guiones
    }

    return (
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {
                categories
                .filter((category) => category && category.trim() !== "") // Filtrar categorías vacías
                .map((category) => {
                    const link = `/categoria/${slugify(category)}`; // Aplica la función slugify
                    return (
                        <Link href={link}>
                            <li className="bg-[#323232] p-[15px] rounded-[15px] border-[2px] border-[#676767] text-sm">{category}</li>
                        </Link>
                    );
                })
            }
        </ul>
    );
}