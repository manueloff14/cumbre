"use client"

import { useParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"

import JobDetail from './JobDetail'
import Header from "@/components/Header"
import HeaderMobile from "@/components/HeaderMobile"

export default function JobPage() {
    const params = useParams()
    const { id } = params
    const [jobData,setJobData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`https://cumbre-server.onrender.com/api/blog/${id}`)
                setJobData(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setError('Failed to fetch data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    useEffect(() => {
        if (loading) {
            document.title = "Cargando vacante...";
        } else if (error) {
            document.title = "Error al cargar vacante";
        } else if (jobData) {
            document.title = `Trabaja como: ${jobData.title}`;
        }
    }, [loading, error, jobData]);

    if (error) return <div>{error}</div>;
    if (loading || !jobData) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="flex flex-col justify-center items-center">
                    <img src="/img/cumbre_logo.png" alt="Cumbre Logo" className="w-[150px] mb-5" />
                    <img src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="Cargando..." className="w-[30px]" />
                </div>
            </div>
        )
    };

    return (
        <div>
            <main className="lg:flex lg:justify-between">
                <Header />
                <div className="lg:w-[75%] lg:ml-[25%] p-4">
                    <HeaderMobile title="Vacante" />
                    <JobDetail data={jobData} />
                </div>
            </main>
        </div>
    );
}