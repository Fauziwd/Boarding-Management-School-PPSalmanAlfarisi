import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Datadiri from "@/Pages/ShowSantri/Datadiri";
import CapHafalan from "@/Pages/ShowSantri/CapHafalan";
import CapAkademik from "@/Pages/ShowSantri/CapAkademik";

export default function SantriShow({ auth, santri, hafalan, akademik }) {
    const [activeTab, setActiveTab] = useState("Data Diri");

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

    const renderContent = () => {
        switch (activeTab) {
            case "Data Diri":
                return <Datadiri santri={santri} />;
            case "Capaian Hafalan":
                console.log(hafalan);  // Tambahkan log ini
                return <CapHafalan hafalan={hafalan} />;
            case "Capaian Akademik":
                console.log(akademik);  // Tambahkan log ini
                return <CapAkademik akademik={akademik} />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Detail ${santri.nama}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-2xl font-bold mb-6">
                                Detail {santri.nama}
                            </h1>
                            <div className="mb-4">
                                <nav className="flex space-x-4">
                                    <button
                                        className={`px-3 py-2 text-sm font-medium ${activeTab === "Data Diri" ? "text-white bg-indigo-500 dark:bg-indigo-700" : "text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-300"} rounded-md`}
                                        onClick={() => setActiveTab("Data Diri")}
                                    >
                                        Data Diri
                                    </button>
                                    <button
                                        className={`px-3 py-2 text-sm font-medium ${activeTab === "Capaian Hafalan" ? "text-white bg-indigo-500 dark:bg-indigo-700" : "text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-300"} rounded-md`}
                                        onClick={() => setActiveTab("Capaian Hafalan")}
                                    >
                                        Capaian Hafalan
                                    </button>
                                    <button
                                        className={`px-3 py-2 text-sm font-medium ${activeTab === "Capaian Akademik" ? "text-white bg-indigo-500 dark:bg-indigo-700" : "text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-300"} rounded-md`}
                                        onClick={() => setActiveTab("Capaian Akademik")}
                                    >
                                        Capaian Akademik
                                    </button>
                                </nav>
                            </div>
                            <div className="mb-4">
                                {/* <Link
                                    href={route('achievements.create', santri.id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                                >
                                    Tambah Pencapaian
                                </Link> */}
                            </div>
                            <div className="overflow-x-auto h-80 hide-scrollbar">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}