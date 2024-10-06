import Link from "next/link";
import showdown from "showdown";

export default function LatestJobs({latestJobs}) {
    const converter = new showdown.Converter();

    return (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:text-[sm]">
            {latestJobs.map((job, index) => (
                <li className="flex">
                <Link href={`/empleo/${job.id}`} className="w-full">
                    <div className="p-[20px] bg-gray-900 rounded-xl mb-[10px] lg:mb-0 flex flex-col lg:min-h-[200px]">
                    <div>
                        <h2 className="font-bold text-[16px]">
                            {job.title_job}
                        </h2>
                        <h2 className="text-sm text-[#c2c2c2]">{job.company}</h2>
                    </div>
                    <div className="text-sm my-3 flex-grow">
                        {/* Renderización segura de HTML */}
                        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(job.miniDescription) }}></div>
                    </div>
                    <ul className="flex items-center text-xs mt-auto">
                        <li className="flex items-center mr-3">
                        <svg
                            className="w-[15px] mr-2"
                            fill="#ffffff"
                            viewBox="0 0 32 32"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ffffff"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                            <path
                                d="M16.114-0.011c-6.559 0-12.114 5.587-12.114 12.204 0 6.93 6.439 14.017 10.77 18.998 0.017 0.020 0.717 0.797 1.579 0.797h0.076c0.863 0 1.558-0.777 1.575-0.797 4.064-4.672 10-12.377 10-18.998 0-6.618-4.333-12.204-11.886-12.204zM16.515 29.849c-0.035 0.035-0.086 0.074-0.131 0.107-0.046-0.032-0.096-0.072-0.133-0.107l-0.523-0.602c-4.106-4.71-9.729-11.161-9.729-17.055 0-5.532 4.632-10.205 10.114-10.205 6.829 0 9.886 5.125 9.886 10.205 0 4.474-3.192 10.416-9.485 17.657zM16.035 6.044c-3.313 0-6 2.686-6 6s2.687 6 6 6 6-2.687 6-6-2.686-6-6-6zM16.035 16.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.207 0 4 1.794 4 4 0.001 2.206-1.747 4.044-3.954 4.044z"
                            ></path>
                            </g>
                        </svg>
                        {job.location}, Colombia
                        </li>
                        <li className="flex items-center">
                        <svg
                            className="w-[15px] mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.8284 6.75736C12.3807 6.75736 12.8284 7.20507 12.8284 7.75736V12.7245L16.3553 14.0653C16.8716 14.2615 17.131 14.8391 16.9347 15.3553C16.7385 15.8716 16.1609 16.131 15.6447 15.9347L11.4731 14.349C11.085 14.2014 10.8284 13.8294 10.8284 13.4142V7.75736C10.8284 7.20507 11.2761 6.75736 11.8284 6.75736Z"
                                fill="#ffffff"
                            ></path>
                            </g>
                        </svg>
                        {job.tiempo}
                        </li>
                    </ul>
                    </div>
                </Link>
                </li>
            ))}
        </ul>
    )
}