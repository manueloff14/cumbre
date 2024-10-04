import Link from 'next/link'

export default function CategoryDetail({data, categoria}) {
    return (
        <div>
            <h1 className="font-bold text-2xl my-3 text-center">{categoria}</h1>
            <div>
                {
                data.map((job) => {
                    return (
                    <div key={job.id} className="bg-gray-900 mb-3 p-3 rounded-xl text-sm">
                        <Link href={`/empleo/${job.id}`}>
                        <h2 className="text-lg font-bold mb-3">{job.title}</h2>
                        <p>{job.company}</p>
                        <p>{job.location}</p>
                        </Link>
                    </div>
                    )
                })
                }
            </div>
        </div>
    )
}