import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { FiPlus, FiSearch, FiUser, FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import Swal from 'sweetalert2';

export default function SantriIndex({ auth, santris, filters, success }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const debouncedSearch = useCallback(
        debounce((nextValue) => {
            router.get(route("santris.index"), { search: nextValue }, {
                preserveState: true,
                replace: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        if (success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: success,
                showConfirmButton: false,
                timer: 3000
            });
        }
    }, [success]);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    
    const handleDelete = (id, name) => {
        Swal.fire({
            title: `Yakin ingin menghapus data ${name}?`,
            text: "Data yang sudah dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('santris.destroy', id), {
                    preserveScroll: true,
                });
            }
        })
    };

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Data Santri" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Data Santri" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <FiUser className="text-teal-500" />
                                Manajemen Data Santri
                            </h1>
                            <Breadcrumbs items={breadcrumbs} />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative flex-grow">
                                <FiSearch className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white transition-all duration-200"
                                    placeholder="Cari NIS atau Nama..."
                                />
                            </div>
                            <Link
                                href={route("santris.create")}
                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FiPlus size={18} />
                                Tambah
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIS</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Santri</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tempat, Tgl Lahir</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {santris.data.length > 0 ? (
                                        santris.data.map((santri, index) => (
                                            <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{santris.from + index}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">{santri.nis}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{santri.nama_santri}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{santri.kelas_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{santri.tempat_lahir}, {new Date(santri.tanggal_lahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link href={route("santris.show", santri.id)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:hover:bg-teal-900/80 transition-all">
                                                        <FiEye size={14} /> Detail
                                                    </Link>
                                                    <Link href={route("santris.edit", santri.id)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80 transition-all">
                                                        <FiEdit2 size={14} /> Edit
                                                    </Link>
                                                    <button onClick={() => handleDelete(santri.id, santri.nama_santri)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 transition-all">
                                                        <FiTrash2 size={14} /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Tidak ada data santri yang cocok dengan pencarian Anda.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {santris.total > 0 && (
                             <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                <Pagination links={santris.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}