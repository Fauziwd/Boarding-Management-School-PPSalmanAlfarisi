import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    ArrowLeftIcon, 
    UserPlusIcon, 
    UserMinusIcon,
    UsersIcon,
    BookOpenIcon
} from '@heroicons/react/24/solid';
import { 
    ChevronDownIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function Show({ auth, halaqoh, availableSantris = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        santri_id: '',
        search: ''
    });

    const addSantriSubmit = (e) => {
        e.preventDefault();
        post(route('halaqohs.addSantri', { halaqoh: halaqoh.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset('santri_id');
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Santri berhasil ditambahkan ke halaqoh',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white'
                    }
                });
            }
        });
    };

    const removeSantri = (santri) => {
        Swal.fire({
            title: `Keluarkan ${santri?.nama_santri || 'Santri ini'}?`,
            text: "Santri akan dikeluarkan dari halaqoh ini",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Keluarkan',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                confirmButton: 'dark:bg-red-600 dark:hover:bg-red-700',
                cancelButton: 'dark:bg-gray-600 dark:hover:bg-gray-500'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('halaqohs.removeSantri', { halaqoh: halaqoh.id }), {
                    santri_id: santri.id
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Dikeluarkan!',
                            text: 'Santri berhasil dikeluarkan dari halaqoh',
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

    const filteredSantris = availableSantris.filter(santri => {
        const nama = santri?.nama_santri?.toLowerCase() || '';
        const nis = santri?.nis?.toLowerCase() || '';
        const searchTerm = data.search.toLowerCase();
        return nama.includes(searchTerm) || nis.includes(searchTerm);
    });

    // Fallback avatar generator
    const getAvatar = (name, background = 'green') => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '')}&background=${background}&color=fff&size=200`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Halaqoh ${halaqoh?.name || ''}`} />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                            <Link 
                                href={route('halaqohs.index')} 
                                className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Halaqoh {halaqoh?.name || 'Tidak Diketahui'}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {halaqoh?.academic_year?.year || 'Tahun Ajaran'} - Semester {halaqoh?.academic_year?.semester || '1'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                <UsersIcon className="w-5 h-5 text-green-500 mr-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {(halaqoh?.santris?.length || 0)} Santri
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add Student Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <UserPlusIcon className="w-5 h-5 text-green-500 mr-2" />
                                    Tambah Santri ke Halaqoh
                                </h3>
                                <div className="relative w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Cari santri..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <form onSubmit={addSantriSubmit} className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <div className="relative">
                                            <select 
                                                value={data.santri_id} 
                                                onChange={(e) => setData('santri_id', e.target.value)} 
                                                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                required
                                            >
                                                <option value="">-- Pilih Santri --</option>
                                                {filteredSantris.map(santri => (
                                                    <option key={santri.id} value={santri.id}>
                                                        {santri.nama_santri || 'Nama tidak tersedia'} (NIS: {santri.nis || 'N/A'}) - {santri.kelas?.nama_kelas || 'Belum ada kelas'}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                        <InputError message={errors.santri_id} className="mt-1" />
                                    </div>
                                    <div className="flex items-end">
                                        <PrimaryButton 
                                            disabled={processing || !data.santri_id} 
                                            className="w-full justify-center py-2.5 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                        >
                                            {processing ? (
                                                <>
                                                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlusIcon className="w-5 h-5 mr-2" />
                                                    Tambah Santri
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <BookOpenIcon className="w-5 h-5 text-green-500 mr-2" />
                                    Daftar Anggota Halaqoh
                                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                        {halaqoh?.santris?.length || 0} Santri
                                    </span>
                                </h3>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Nama Santri
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                NIS
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Kelas Asal
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {halaqoh?.santris?.length > 0 ? (
                                            halaqoh.santris.map(santri => (
                                                <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300 font-medium">
                                                                {(santri.nama_santri || '?').charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {santri.nama_santri || 'Nama tidak tersedia'}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Bergabung: {santri.created_at ? new Date(santri.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                        {santri.nis || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                                            {santri.kelas?.nama_kelas || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            onClick={() => removeSantri(santri)} 
                                                            className="p-1.5 rounded-lg text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                            title="Keluarkan dari halaqoh"
                                                        >
                                                            <UserMinusIcon className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="text-gray-500 dark:text-gray-400">
                                                        <BookOpenIcon className="mx-auto h-12 w-12" />
                                                        <h3 className="mt-2 text-sm font-medium">Belum ada santri di halaqoh ini</h3>
                                                        <p className="mt-1 text-sm">Tambahkan santri menggunakan form di atas</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}