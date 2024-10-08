import Image from 'next/image'
import Link from 'next/link'

export default function HeaderMobile({title}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-grow basis-0 lg:hidden">
                <Link href="/">
                    <Image
                        src="/img/cumbre_icon-logo.svg"
                        alt="Logo Cumbre"
                        width={40}
                        height={40}
                    />
                </Link>
            </div>
            <span className="text-lg">
                <strong>{title}</strong>
            </span>
            <div className="flex flex-grow justify-end basis-0">
                <Link href="/ayuda">
                    <button className="bg-red-500 py-2 px-4 rounded-xl">Ayuda</button>
                </Link>
            </div>
        </div>
    )
}