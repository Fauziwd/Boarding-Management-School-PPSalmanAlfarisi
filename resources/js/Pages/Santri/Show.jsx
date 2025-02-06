import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Datadiri from "@/Pages/ShowSantri/Datadiri";
import axios from "axios"; // Tambahkan axios untuk fetching data

export default function SantriShow({ auth, santri }) {
    const [akademiks, setAkademiks] = useState([]);
    const [hafalans, setHafalans] = useState([]); // State untuk hafalan

    useEffect(() => {
        if (santri) {
            fetchAkademiks(santri.id);
            fetchHafalans(santri.id); // Ambil data hafalan juga
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
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={breadcrumbs} />

                    {/* Detail Santri */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 flex">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex w-full">
                            <div className="flex-shrink-0 mr-6">
                                <img
                                    src={"/pp.jpeg"}
                                    alt={`Foto ${santri.nama}`}
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>

                            <div className="flex-grow">
                                <header className="mb-6">
                                    <h1 className="text-2xl font-bold">
                                        Detail {santri.nama}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Informasi mengenai data diri, capaian hafalan, dan capaian akademik.
                                    </p>
                                </header>

                                {/* Data Diri */}
                                <div className="mb-6">
                                    <Datadiri santri={santri} />
                                </div>

                                {/* Tabel Pencapaian Akademik */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-4">
                                        Pencapaian Akademik
                                    </h2>
                                    {akademiks.length === 0 ? (
                                        <p className="text-gray-500">Belum ada data pencapaian akademik.</p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Kitab
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Bab
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Tanggal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {akademiks.map((akademik, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {akademik.kitab}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {akademik.bab}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {new Date(akademik.created_at).toLocaleDateString("id-ID")}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Tabel Hafalan */}
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">
                                        Pencapaian Hafalan
                                    </h2>
                                    {hafalans.length === 0 ? (
                                        <p className="text-gray-500">Belum ada data hafalan.</p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Juz
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Bulan
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Tanggal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {hafalans.map((hafalan, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {hafalan.juz}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {hafalan.month}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {new Date(hafalan.created_at).toLocaleDateString("id-ID")}
                                                        </td>
                                                    </tr>
                                                ))}
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
