import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";  // Import the Pagination component

export default function SantriIndex({ auth, santris }) {
    // Data untuk breadcrumbs
    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Santri" }
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Santri" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />

                        <Link
                            href={route("santris.create")}
                            className="hover:bg-indigo-600 hover:text-white border rounded-md border-indigo-500 text-indigo-600 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Santri
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 dark:text-gray-100">
                            <table className="border-b-2 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">No</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">NIS</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Nama</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Tempat Lahir</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Tanggal Lahir</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Tahun Lulus</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {santris.data.length > 0 ? (
                                        santris.data.map(({ id, nis, nama, tempat_lahir, tanggal_lahir, tahun_lulus }) => (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{id}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{nis}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{nama}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{tempat_lahir}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{tanggal_lahir}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">{tahun_lulus}</td>
                                                <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                    <Link
                                                        href={route("santris.show", id)}
                                                        className="text-indigo-400 hover:text-indigo-200"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                Tidak ada data santri.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={santris.links} />  {/* Add Pagination component here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}