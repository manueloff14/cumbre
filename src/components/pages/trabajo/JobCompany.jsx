export default function JobCompany({data}) {
    return (
        <div
            className="flex flex-col items-center bg-gray-900 p-[20px] rounded-xl my-5 border border-white shadow-sm shadow-white"
        >
            <img
                className="rounded-xl w-[100px] mb-2"
                src={data.jobDetails.img_empresa}
                alt="imagen"
            />
            <h2 className="font-bold text-lg my-3">{data.company}</h2>
            <hr />
            <span>
                <strong>Sector</strong>
            </span>
            <span className="text-sm text-[#d3d3d3]">
                Consultorías / Asesorías
            </span>
        </div>
    )
}