import Image from 'next/image'

export default function HeaderMobile({title}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-grow basis-0 lg:hidden">
                <Image
                    src="/img/cumbre_icon-logo.svg"
                    alt="Logo Cumbre"
                    width={40}
                    height={40}
                />
            </div>
            <span className="text-lg">
                <strong>{title}</strong>
            </span>
            <div className="flex flex-grow justify-end basis-0">
                <a href="/ayuda">
                    <button className="bg-red-500 py-2 px-4 rounded-xl">Ayuda</button>
                </a>
            </div>
        </div>
    )
}