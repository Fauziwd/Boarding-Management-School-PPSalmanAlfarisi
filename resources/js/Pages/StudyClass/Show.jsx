import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    ArrowLeftIcon, 
    UserPlusIcon, 
    UserMinusIcon,
    IdentificationIcon,
    AcademicCapIcon,
    CalendarIcon,
    UsersIcon,
    XMarkIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/solid';
import { 
    ChevronDownIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function Show({ auth, studyClass, availableSantris }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        santri_id: '',
        search: ''
    });

    const addSantriSubmit = (e) => {
        e.preventDefault();
        post(route('study-classes.addSantri', { study_class: studyClass.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset('santri_id');
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Santri berhasil ditambahkan ke kelas',
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
            title: `Keluarkan ${santri.nama_santri}?`,
            text: "Santri akan dikeluarkan dari kelas ini",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Keluarkan',
            cancelButtonText: 'Batal',
            backdrop: `
                rgba(0,0,0,0.7)
                url("/images/alert-student.gif")
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
                router.post(route('study-classes.removeSantri', { study_class: studyClass.id }), {
                    santri_id: santri.id
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Dikeluarkan!',
                            text: 'Santri berhasil dikeluarkan dari kelas',
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

    const filteredSantris = availableSantris.filter(santri => 
        santri.nama_santri.toLowerCase().includes(data.search.toLowerCase()) || 
        santri.nis.toLowerCase().includes(data.search.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Kelas ${studyClass.name}`} />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                            <Link 
                                href={route('study-classes.index')} 
                                className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelas {studyClass.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {studyClass.academic_year?.year || 'Tahun Ajaran'} - Semester {studyClass.academic_year?.semester || '1'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                <UsersIcon className="w-5 h-5 text-teal-500 mr-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {studyClass.santris.length} Santri
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add Student Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <UserPlusIcon className="w-5 h-5 text-teal-500 mr-2" />
                                    Tambah Santri ke Kelas
                                </h3>
                                <div className="relative w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                                                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">-- Pilih Santri --</option>
                                                {filteredSantris.map(santri => (
                                                    <option key={santri.id} value={santri.id}>
                                                        {santri.nama_santri} (NIS: {santri.nis}) - {santri.kelas?.nama_kelas || 'Belum ada kelas'}
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
                                            className="w-full justify-center py-2.5"
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
                                    <UsersIcon className="w-5 h-5 text-teal-500 mr-2" />
                                    Daftar Santri
                                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200">
                                        {studyClass.santris.length} Santri
                                    </span>
                                </h3>
                                
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                                            <option>Semua Status</option>
                                            <option>Aktif</option>
                                            <option>Non-Aktif</option>
                                        </select>
                                        <ChevronDownIcon className="w-5 h-5 absolute right-2 top-2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
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
                                                Tahun Ke
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {studyClass.santris.length > 0 ? (
                                            studyClass.santris.map(santri => (
                                                <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-300 font-medium">
                                                                {santri.nama_santri.charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {santri.nama_santri}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Bergabung: {new Date(santri.created_at).toLocaleDateString('id-ID')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                        {santri.nis}
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
                                                            title="Keluarkan dari kelas"
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
                                                        <UsersIcon className="mx-auto h-12 w-12" />
                                                        <h3 className="mt-2 text-sm font-medium">Belum ada santri di kelas ini</h3>
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