import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { 
    CalendarDaysIcon, 
    PlusCircleIcon, 
    PencilIcon, 
    TrashIcon,
    ChevronUpDownIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
    CheckBadgeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

export default function Index({ auth, kelasList }) {
    const { delete: destroy } = useForm();

    const deleteTahun = (id, name) => {
        Swal.fire({
            title: `Hapus Tahun Santri "${name}"?`,
            text: "Semua data terkait tahun ini akan dihapus permanen",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            backdrop: `
                rgba(0,0,0,0.7)
                url("/images/alert-calendar.gif")
                left top
                no-repeat
            `,
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                confirmButton: 'dark:bg-red-600 dark:hover:bg-red-700',
                cancelButton: 'dark:bg-gray-600 dark:hover:bg-gray-500'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('tahun-santri.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Data tahun santri berhasil dihapus',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'dark:bg-gray-800 dark:text-white'
                            }
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Tahun Santri</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Kelola tahun akademik dan tingkat santri
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={route('tahun-santri.create')} 
                        className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Tambah Tahun
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Tahun Santri" />
            
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-teal-100/50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 mr-4">
                                    <CalendarDaysIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tahun</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kelasList.total}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                                    <FunnelIcon className="w-4 h-4 mr-2" />
                                    Filter
                                </h3>
                            </div>
                            <div className="relative">
                                <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option>Semua Tahun</option>
                                    <option>Tahun Aktif</option>
                                    <option>Tahun Arsip</option>
                                </select>
                                <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Cari tahun/tingkat..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                Nama Tahun/Tingkat
                                                <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {kelasList.data.length > 0 ? (
                                        kelasList.data.map((kelas) => (
                                            <tr key={kelas.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-300">
                                                            <CalendarDaysIcon className="w-5 h-5" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {kelas.nama_kelas}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Dibuat: {new Date(kelas.created_at).toLocaleDateString('id-ID')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                                        Aktif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link 
                                                            href={route('tahun-santri.edit', kelas.id)} 
                                                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteTahun(kelas.id, kelas.nama_kelas)} 
                                                            className="p-1.5 rounded-lg text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    <CalendarDaysIcon className="mx-auto h-12 w-12" />
                                                    <h3 className="mt-2 text-sm font-medium">Belum ada tahun santri</h3>
                                                    <p className="mt-1 text-sm">Tambahkan tahun santri baru untuk memulai</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {kelasList.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                                <Pagination links={kelasList.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}