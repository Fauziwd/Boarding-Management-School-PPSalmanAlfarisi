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

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 scrollbar-gutter-stable">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 mr-6">
                                    {santri.foto ? (
                                        <img
                                            src={`/storage/${santri.foto}`}
                                            alt={`Foto ${santri.nama}`}
                                            draggable="false"
                                            className="w-32 h-32 shadow-xl border-2 border-teal-500 dark:border-white rounded-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={"/pp.jpg"}
                                            alt={`Foto ${santri.nama}`}
                                            draggable="false"
                                            className="w-32 h-32 shadow-xl border-2 border-teal-500 dark:border-white rounded-full object-cover"
                                        />
                                    )}
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
                                className="mb-4 px-4 py-2 bg-white hover:bg-teal-200 dark:bg-gray-800 border border-teal-700 dark:border-gray-600 dark:hover:border-emerald-200 text-teal-800 dark:text-gray-100 dark:hover:text-emerald-200 dark:hover:bg-emerald-900 hover:text-teal-900 rounded-md"
                            >
                                Export Excel
                            </button>

                            <Tab.Group className={"z-50"}>
                                <Tab.List className="flex p-1 space-x-1 dark:bg-gray-600 bg-teal-700 rounded-md shadow-xl">
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-teal-700 dark:bg-gray-600 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-500 dark:bg-blue-900/20 bg-white dark:bg-gray-800 rounded shadow-xl"
                                        }
                                    >
                                        Data Diri
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-teal-700 dark:bg-gray-600 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-500 dark:bg-blue-900/20 bg-white dark:bg-gray-800 rounded shadow-xl"
                                        }
                                    >
                                        Pencapaian Akademik
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            selected
                                                ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-teal-700 dark:bg-gray-600 rounded-lg"
                                                : "w-full py-2.5 text-sm leading-5 font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-500 dark:bg-blue-900/20 bg-white dark:bg-gray-800 rounded shadow-xl"
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
