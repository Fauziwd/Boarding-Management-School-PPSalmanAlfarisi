import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, hafalans }) {
    const breadcrumbs = [
        { label: "Home", href: route('dashboard') },
        { label: "Hafalan" },
    ];

    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        destroy(route('hafalan.destroy', id), {
            preserveScroll: true,
            onSuccess: () => alert(`Hafalan berhasil dihapus!`)
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Hafalan" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />
                        <Link
                            href={route("hafalan.create")}
                            className="dark:hover:bg-indigo-900 hover:bg-indigo-100 border rounded-md border-indigo-500 text-indigo-700 hover:text-indigo-900 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Hafalan
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl mt-3">
                                <thead>
                                <tr className="border-b-2 border-indigo-200 dark:border-gray-900">
                                <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">No</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Nama Santri</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Juz</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Bulan</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                        Aksi</th>
                                    </tr>
                                </thead> 
                                <tbody className="bg-white divide-y divide-indigo-500 dark:bg-gray-600 dark:divide-gray-900">
                                    {hafalans.data.length > 0 ? (
                                        hafalans.data.map(({ id, santri, juz, month }, index) => (
                                            <tr key={id} className="border-b-2">
                                                 <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">{index + 1}</td>
                                                 <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">{santri.nama}</td>
                                                 <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">{juz}</td>
                                                 <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">{month}</td>
                                                 <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    <Link
                                                        href={route("hafalan.edit", id)}
                                                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(id)}
                                                        className="ml-2 inline-block px-4 py-2 bg-red-600 text-white rounded-md"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">Tidak ada data hafalan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={hafalans.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}