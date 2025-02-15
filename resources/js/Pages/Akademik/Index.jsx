import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import SweetAlert from "@/Components/SweetAlert";

export default function AkademikIndex({ auth, akademiks }) {
    const breadcrumbs = [
        { label: "Home", href: route('dashboard') },
        { label: "Akademik" },
    ];

    // Pastikan akademiks ada dan memiliki struktur yang diharapkan
    const data = akademiks?.data || [];
    const links = akademiks?.links || [];

    const { delete: destroy } = useForm();

    const handleDelete = (id, name) => {
        destroy(route('akademik.destroy', id), {
            preserveScroll: true,
            onSuccess: () => alert(`Pencapaian oleh ${name} berhasil dihapus!`)
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Akademik" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />
                        <Link
                            href={route("akademik.create")}
                            className="dark:hover:bg-indigo-900 hover:bg-indigo-100 border rounded-md border-indigo-500 text-indigo-700 hover:text-indigo-900 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Akademik
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl mt-3">
                                <thead>
                                <tr className="border-b-2 border-indigo-200 dark:border-gray-900">
                                <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">No</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Nama Santri</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Kitab</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">Bab</th>
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                        Aksi</th>
                                    </tr>
                                </thead> 
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map(({ id, santri, kitab, bab }, index) => (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4 text-lg text-gray-800 dark:text-white">{index + 1}</td>
                                                <td className="px-6 py-4 text-lg text-gray-800 dark:text-white">{santri.nama}</td>
                                                <td className="px-6 py-4 text-lg text-gray-800 dark:text-white">{kitab}</td>
                                                <td className="px-6 py-4 text-lg text-gray-800 dark:text-white">{bab}</td>
                                                <td className="px-6 py-4 text-lg text-gray-800 dark:text-white">
                                                    <Link
                                                        href={route("akademik.edit", id)}
                                                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <SweetAlert
                                                        title="Konfirmasi Penghapusan"
                                                        text={`Apakah Anda yakin ingin menghapus pencapaian oleh ${santri.nama}?`}
                                                        icon="warning"
                                                        confirmButtonText="Ya, hapus!"
                                                        onConfirm={() => handleDelete(id, santri.nama)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">Tidak ada data akademik.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}