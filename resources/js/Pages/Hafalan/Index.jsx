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
                            className="hover:bg-indigo-600 border rounded-md border-indigo-500 text-white font-bold py-2 px-4"
                        >
                            Tambah Hafalan
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="border-b-2 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">No</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">Nama Santri</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">Juz</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">Bulan</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hafalans.data.length > 0 ? (
                                        hafalans.data.map(({ id, santri, juz, month }, index) => (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4 text-lg text-white">{index + 1}</td>
                                                <td className="px-6 py-4 text-lg text-white">{santri.nama}</td>
                                                <td className="px-6 py-4 text-lg text-white">{juz}</td>
                                                <td className="px-6 py-4 text-lg text-white">{month}</td>
                                                <td className="px-6 py-4 text-lg text-white">
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