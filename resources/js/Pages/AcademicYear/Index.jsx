import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiCalendar, FiBook } from 'react-icons/fi';

export default function AcademicYearIndex({ auth, academicYears, success, error }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, patch, delete: destroy, errors, reset, processing } = useForm({
        id: null,
        year: '',
        semester: 'Ganjil',
    });

    React.useEffect(() => {
        if (success) {
            Swal.fire({ 
                toast: true, 
                position: 'top-end', 
                icon: 'success', 
                title: success, 
                showConfirmButton: false, 
                timer: 3000,
                background: '#1f2937',
                color: '#f3f4f6',
                iconColor: '#10b981'
            });
        }
        if (error) {
            Swal.fire({ 
                toast: true, 
                position: 'top-end', 
                icon: 'error', 
                title: error, 
                showConfirmButton: false, 
                timer: 3000,
                background: '#1f2937',
                color: '#f3f4f6',
                iconColor: '#ef4444'
            });
        }
    }, [success, error]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        reset();
    };

    const handleCreate = () => {
        setIsEditing(false);
        reset();
        openModal();
    };

    const handleEdit = (year) => {
        setIsEditing(true);
        setData({
            id: year.id,
            year: year.year,
            semester: year.semester,
        });
        openModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('academic-years.update', data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('academic-years.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };
    
    const handleSetActive = (id) => {
        Swal.fire({
            title: 'Aktifkan Tahun Ajaran?',
            text: "Anda akan mengubah tahun ajaran aktif. Pastikan ini adalah tahun ajaran yang benar.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Aktifkan',
            cancelButtonText: 'Batal',
            background: '#1f2937',
            color: '#f3f4f6',
            backdrop: 'rgba(0,0,0,0.7)'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('academic-years.set-active', id), {
                    preserveScroll: true,
                });
            }
        });
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            background: '#1f2937',
            color: '#f3f4f6',
            backdrop: 'rgba(0,0,0,0.7)'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('academic-years.destroy', id), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Tahun Ajaran" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Tahun Ajaran</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Kelola tahun ajaran dan semester untuk sistem akademik
                            </p>
                        </div>
                        <PrimaryButton 
                            onClick={handleCreate} 
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            <FiPlus className="text-lg" /> 
                            <span>Tambah Tahun Ajaran</span>
                        </PrimaryButton>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                                    <FiCalendar className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tahun Ajaran</h3>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{academicYears.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                                    <FiCheckCircle className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tahun Aktif</h3>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                                        {academicYears.find(y => y.is_active) ? '1' : '0'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                                    <FiBook className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</h3>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                                        {[...new Set(academicYears.map(y => y.semester))].length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tahun Ajaran</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Semester</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {academicYears.length > 0 ? (
                                        academicYears.map((year) => (
                                            <tr key={year.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                                            <FiCalendar className="text-lg" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{year.year}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <FiBook className="text-gray-400 dark:text-gray-500" />
                                                        <span className="text-sm text-gray-900 dark:text-white">{year.semester}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {year.is_active ? (
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/50 dark:to-green-900/50 dark:text-emerald-200">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                            Tidak Aktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    {!year.is_active && (
                                                        <button 
                                                            onClick={() => handleSetActive(year.id)} 
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                                                            title="Aktifkan"
                                                        >
                                                            <FiCheckCircle className="mr-1" /> Aktifkan
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleEdit(year)} 
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                                                        title="Edit"
                                                    >
                                                        <FiEdit className="mr-1" /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(year.id)} 
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                                                        title="Hapus"
                                                    >
                                                        <FiTrash2 className="mr-1" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4">
                                                    <FiCalendar className="w-full h-full" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada tahun ajaran</h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Tambahkan tahun ajaran baru untuk memulai
                                                </p>
                                                <div className="mt-4">
                                                    <PrimaryButton onClick={handleCreate}>
                                                        <FiPlus className="mr-2" /> Tambah Tahun Ajaran
                                                    </PrimaryButton>
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

            {/* Modal Form */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                            <FiCalendar className="text-xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
                        </h2>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="year" value="Tahun Ajaran (Contoh: 2024/2025)" />
                            <TextInput 
                                id="year" 
                                value={data.year} 
                                onChange={e => setData('year', e.target.value)} 
                                className="mt-1 block w-full" 
                                placeholder="Masukkan tahun ajaran"
                                required 
                            />
                            <InputError message={errors.year} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="semester" value="Semester" />
                            <div className="mt-1 relative">
                                <select 
                                    id="semester" 
                                    value={data.semester} 
                                    onChange={e => setData('semester', e.target.value)} 
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 rounded-lg shadow-sm appearance-none"
                                    required
                                >
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <FiBook className="text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <InputError message={errors.semester} className="mt-2" />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} type="button">Batal</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (
                                'Simpan'
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}