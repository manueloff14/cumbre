export default function JobResumen({data}) {
    return (
        <div>
            <h2 className="my-5 font-bold text-lg">Resumen de la vacante</h2>
            <table className="min-w-full bg-gray-900 shadow-lg rounded-lg overflow-hidden text-sm">
                <thead>
                    <tr>
                        <th className="bg-blue-600 text-white px-6 py-3 text-left border-b border-gray-700">
                            Campo
                        </th>
                        <th className="bg-blue-600 text-white px-6 py-3 text-left border-b border-gray-700">
                            Detalle
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Fuente</td>
                        <td className="border-b border-gray-700 px-6 py-3">
                            <a href={`https://${data.jobDetails.fuente}`}>
                                {data.jobDetails.fuente}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Título</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.title}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Empresa</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.company}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Salario</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.salary}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Ubicación</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.location}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Fecha de Publicación</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.jobDetails.date_pub}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Fecha de Vencimiento</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.jobDetails.date_ven}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Profesión</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.jobDetails.proffesion}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Tipo de Contrato</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.contrato}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 px-6 py-3">Horario</td>
                        <td className="border-b border-gray-700 px-6 py-3">{data.horario}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}