import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Datadiri from "@/Pages/ShowSantri/Datadiri";
import Akademik from "@/Pages/ShowSantri/Akademik";
import Hafalan from "@/Pages/ShowSantri/Hafalan";
import axios from "axios";
import { Tab } from "@headlessui/react";
import { exportToExcel } from "@/utils/exportToExcel";
import { FiDownload } from "react-icons/fi";

export default function SantriShow({ auth, santri }) {
    const [akademiks, setAkademiks] = useState([]);
    const [hafalans, setHafalans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (santri) {
            Promise.all([
                fetchAkademiks(santri.id),
                fetchHafalans(santri.id),
            ]).finally(() => setIsLoading(false));
        }
    }, [santri]);

    const fetchAkademiks = async (santriId) => {
        try {
            const response = await axios.get(`/api/akademiks/${santriId}`);
            setAkademiks(response.data);
        } catch (error) {
            console.error("Error fetching akademiks:", error);
        }
    };

    const fetchHafalans = async (santriId) => {
        try {
            const response = await axios.get(`/api/hafalans/${santriId}`);
            setHafalans(response.data);
        } catch (error) {
            console.error("Error fetching hafalans:", error);
        }
    };

    if (!santri) {
        return (
            <AuthenticatedLayout auth={auth}>
                <Head title="Detail Santri" />
                <div className="py-6 text-center">Memuat data...</div>
            </AuthenticatedLayout>
        );
    }

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Santri", href: "/santris" },
        { label: `${santri.nama_santri}` },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Detail ${santri.nama_santri}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbs} />

                    <div className="overflow-hidden bg-white shadow-xl sm:rounded-2xl dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Profile Header Section */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                                <div className="relative">
                                    <img
                                        src={
                                            santri.foto_url ||
                                            "/img/default-avatar.png"
                                        } // Gunakan foto_url
                                        alt={`Foto ${santri.nama_santri || `/img/pp.jpg`}`}
                                        draggable="false"
                                        className="w-32 h-32 shadow-lg border-4 border-white dark:border-gray-700 rounded-full object-cover"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-teal-500 dark:bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                        {santri.nis}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {santri.nama_santri}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                                        Informasi lengkap mengenai data diri,
                                        capaian hafalan, dan prestasi akademik
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() =>
                                                exportToExcel(
                                                    santri,
                                                    akademiks,
                                                    hafalans
                                                )
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-white rounded-lg shadow-md transition-all duration-300"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            Export Excel
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <Tab.Group>
                                <Tab.List className="flex space-x-1 rounded-xl bg-teal-900/20 dark:bg-gray-700 p-1">
                                    {[
                                        "Data Diri",
                                        "Pencapaian Akademik",
                                        "Pencapaian Hafalan",
                                    ].map((tab) => (
                                        <Tab
                                            key={tab}
                                            className={({ selected }) =>
                                                `w-full py-3 text-sm font-medium leading-5 rounded-lg transition-all duration-300 ${
                                                    selected
                                                        ? "bg-white text-teal-700 shadow-lg dark:bg-gray-600 dark:text-white"
                                                        : "text-teal-600 hover:bg-white/[0.12] hover:text-teal-800 dark:text-gray-300 dark:hover:text-white"
                                                }`
                                            }
                                        >
                                            {tab}
                                        </Tab>
                                    ))}
                                </Tab.List>

                                {/* Tab Content */}
                                <Tab.Panels className="mt-4">
                                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-sm">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                                            </div>
                                        ) : (
                                            <Datadiri santri={santri} />
                                        )}
                                    </Tab.Panel>

                                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-sm">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                                            </div>
                                        ) : (
                                            <Akademik akademiks={akademiks} />
                                        )}
                                    </Tab.Panel>

                                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700 p-6 shadow-sm">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                                            </div>
                                        ) : (
                                            <Hafalan hafalans={hafalans} />
                                        )}
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
