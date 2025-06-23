import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import SweetAlert from "@/Components/SweetAlert";
import { FiEdit2, FiPlus, FiAward, FiBook, FiUser } from "react-icons/fi";

export default function AkademikIndex({ auth, akademiks }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Akademik" },
    ];

    const data = akademiks?.data || [];
    const links = akademiks?.links || [];

    const { delete: destroy } = useForm();

    const handleDelete = (id, name) => {
        destroy(route("akademik.destroy", id), {
            preserveScroll: true,
            onSuccess: () => alert(`Pencapaian oleh ${name} berhasil dihapus!`),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Akademik" />
            <div className="py-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                <FiBook className="mr-3 text-teal-500" />
                                Pencapaian Akademik
                            </h1>
                            <Breadcrumbs items={breadcrumbs} />
                        </div>
                        <Link
                            href={route("akademik.create")}
                            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <FiPlus className="text-lg" />
                            Tambah Akademik
                        </Link>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-gray-900 dark:to-gray-800 text-white">
                                            <th className="px-6 py-4 text-left font-bold rounded-tl-xl">
                                                <div className="flex items-center">
                                                    <span className="mr-2">#</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold">
                                                <div className="flex items-center">
                                                    <FiUser className="mr-2" />
                                                    Nama Santri
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold">
                                                <div className="flex items-center">
                                                    <FiBook className="mr-2" />
                                                    Kitab
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold">
                                                <div className="flex items-center">
                                                    <FiAward className="mr-2" />
                                                    Bab
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold rounded-tr-xl">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.length > 0 ? (
                                            data.map(
                                                (
                                                    { id, santri, kitab, bab },
                                                    index
                                                ) => (
                                                    <tr
                                                        key={id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900 dark:text-white">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                                                                    <span className="text-teal-600 dark:text-teal-300 font-semibold">
                                                                        {santri.nama.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{santri.nama}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                            {kitab}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                                                {bab}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route(
                                                                        "akademik.edit",
                                                                        id
                                                                    )}
                                                                    className="flex items-center px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors duration-200 shadow-sm"
                                                                >
                                                                    <FiEdit2 className="mr-2" />
                                                                    Edit
                                                                </Link>
                                                                <SweetAlert
                                                                    title="Konfirmasi Penghapusan"
                                                                    text={`Apakah Anda yakin ingin menghapus pencapaian oleh ${santri.nama}?`}
                                                                    icon="warning"
                                                                    confirmButtonText="Ya, hapus!"
                                                                    onConfirm={() =>
                                                                        handleDelete(
                                                                            id,
                                                                            santri.nama
                                                                        )
                                                                    }
                                                                    className="flex items-center px-4 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 shadow-sm"
                                                                >
                                                                    Hapus
                                                                </SweetAlert>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiBook className="text-5xl text-gray-400 dark:text-gray-500 mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                                            Tidak ada data akademik
                                                        </h3>
                                                        <p className="text-gray-400 dark:text-gray-500 mt-1">
                                                            Tambahkan data akademik baru untuk memulai
                                                        </p>
                                                        <Link
                                                            href={route("akademik.create")}
                                                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                        >
                                                            <FiPlus className="mr-2" />
                                                            Tambah Akademik
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}