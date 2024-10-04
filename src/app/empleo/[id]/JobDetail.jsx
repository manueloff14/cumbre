import JobDescription from "@/components/pages/trabajo/JobDescription"
import JobResumen from "@/components/pages/trabajo/JobResumen"
import JobCompany from "@/components/pages/trabajo/JobCompany"

export default function JobDetail({data}) {
    return (
        <div>
            <h1 className="font-bold text-2xl my-3">{data.title}</h1>

            {/* Mobile */}
            <div className="lg:hidden">
                <JobCompany data={data} />

                <JobDescription jobDescription={data.jobDescription} />

                <JobResumen data={data} />

                <a href={data.job_url} className="">
                    <button className="bg-sky-700 w-full p-4 rounded-xl mt-4 font-bold">
                        Aplicar a la vacante
                    </button>
                </a>
            </div>

            {/* PC */}
            <div className="hidden lg:flex">
                <div className="w-[70%] pr-4">
                    <JobDescription jobDescription={data.jobDescription} />
                </div>
                <div className="w-[30%]">
                    <JobCompany data={data} />
                    <JobResumen data={data} />
                    <a href={data.job_url} className="">
                        <button className="bg-sky-700 w-full p-4 rounded-xl mt-4 font-bold">
                            Aplicar a la vacante
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}