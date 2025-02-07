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

export default function SantriShow({ auth, santri }) {
    const [akademiks, setAkademiks] = useState([]);
    const [hafalans, setHafalans] = useState([]);

    useEffect(() => {
        if (santri) {
            fetchAkademiks(santri.id);
            fetchHafalans(santri.id);
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
        { label: `${santri.nama}` },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Detail ${santri.nama}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbs} />

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 mr-6">
                                    <img
                                        src={"/pp.jpeg"}
                                        alt={`Foto ${santri.nama}`}
                                        className="w-12 h-12 rounded-full"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Detail {santri.nama}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Informasi mengenai data diri, capaian
                                        hafalan, dan capaian akademik.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    exportToExcel(santri, akademiks, hafalans)
                                }
                                className="mb-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Export
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-file-earmark-spreadsheet"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z" />
                                </svg>
                            </button>

                            <Tab.Group>
                                <Tab.List className="flex p-1 space-x-1 bg-gray-200/5 rounded-md">
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 bg-white dark:bg-gray-200 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-blue-100 bg-blue-900/20 rounded-lg"
                                        }
                                    >
                                        Data Diri
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 bg-white dark:bg-gray-200 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-blue-100 bg-blue-900/20 rounded-lg"
                                        }
                                    >
                                        Pencapaian Akademik
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 bg-white dark:bg-gray-200 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-blue-100 bg-blue-900/20 rounded-lg"
                                        }
                                    >
                                        Pencapaian Hafalan
                                    </Tab>
                                </Tab.List>
                                <Tab.Panels className="mt-2">
                                    <Tab.Panel className="rounded shadow-sm">
                                        <Datadiri santri={santri} />
                                    </Tab.Panel>
                                    <Tab.Panel className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                                        <Akademik akademiks={akademiks} />
                                    </Tab.Panel>
                                    <Tab.Panel className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                                        <Hafalan hafalans={hafalans} />
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
