import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Datadiri from "@/Pages/ShowSantri/Datadiri";
import axios from "axios";

export default function SantriShow({ auth, santri }) {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        if (santri) {
            fetchAchievements(santri.id);
        }
    }, [santri]);

    const fetchAchievements = async (santriId) => {
        try {
            const response = await axios.get(`/api/achievements/${santriId}`);
            setAchievements(response.data);
        } catch (error) {
            console.error("Error fetching achievements:", error);
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
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={breadcrumbs} />

                    {/* Letterhead Layout */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 flex">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex w-full">
                            {/* Logo */}
                            <div className="flex-shrink-0 mr-6">
                                <img
                                    src={
                                      "/pp.jpeg"
                                    }
                                    alt={`Foto ${santri.nama}`}
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <header className="mb-6">
                                    <h1 className="text-2xl font-bold">
                                        Detail {santri.nama}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Informasi mengenai data diri, capaian
                                        hafalan, dan capaian akademik.
                                    </p>
                                </header>

                                {/* Data Diri */}
                                <div className="mb-6">
                                    <Datadiri santri={santri} />
                                </div>

                                {/* Tabel Pencapaian */}
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">
                                        Pencapaian
                                    </h2>
                                    {achievements.length === 0 ? (
                                        <p className="text-gray-500">
                                            Belum ada data pencapaian.
                                        </p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Jenis Pencapaian
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Judul
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Deskripsi
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Tanggal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {achievements.map(
                                                    (achievement, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                {achievement.type ===
                                                                "hafalan"
                                                                    ? "Capaian Hafalan"
                                                                    : "Capaian Akademik"}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                {
                                                                    achievement.title
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                {
                                                                    achievement.description
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                {
                                                                    achievement.date
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
