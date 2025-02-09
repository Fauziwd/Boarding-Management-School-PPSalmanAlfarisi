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
                            className="hover:bg-indigo-100 border rounded-md border-indigo-500 text-indigo-800 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Akademik
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="border-b-2 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">No</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Nama Santri</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Kitab</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Bab</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-800 dark:text-white">Aksi</th>
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