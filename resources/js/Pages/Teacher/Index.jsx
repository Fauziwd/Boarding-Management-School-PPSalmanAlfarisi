import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { AcademicCapIcon, PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Swal from 'sweetalert2';

// Helper untuk warna badge
const getRoleColor = (role) => {
    switch (role) {
        case 'Murobbi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
        case 'Muhafidz': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
        case 'Mudaris': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const ROLE_OPTIONS = [
    { value: '', label: 'Semua Peran' },
    { value: 'Murobbi', label: 'Murobbi' },
    { value: 'Muhafidz', label: 'Muhafidz' },
    { value: 'Mudaris', label: 'Mudaris' }
];

const SORT_OPTIONS = [
    { value: '', label: 'Urutkan berdasarkan' },
    { value: 'az', label: 'Nama (A-Z)' },
    { value: 'za', label: 'Nama (Z-A)' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' }
];

export default function Index({ auth, teachers }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Filter, search, and sort data locally (for demo; for production, move to backend)
    const filteredTeachers = useMemo(() => {
        let data = teachers.data;

        // Filter by role
        if (roleFilter) {
            data = data.filter(teacher =>
                teacher.roles && teacher.roles.includes(roleFilter)
            );
        }
        // Search by name/email
        if (search) {
            const s = search.toLowerCase();
            data = data.filter(teacher =>
                teacher.user.name.toLowerCase().includes(s) ||
                teacher.user.email.toLowerCase().includes(s)
            );
        }
        // Sort
        if (sortBy === 'az') {
            data = [...data].sort((a, b) => a.user.name.localeCompare(b.user.name));
        } else if (sortBy === 'za') {
            data = [...data].sort((a, b) => b.user.name.localeCompare(a.user.name));
        } else if (sortBy === 'newest') {
            data = [...data].sort((a, b) => new Date(b.user.created_at) - new Date(a.user.created_at));
        } else if (sortBy === 'oldest') {
            data = [...data].sort((a, b) => new Date(a.user.created_at) - new Date(b.user.created_at));
        }

        return data;
    }, [teachers.data, search, roleFilter, sortBy]);

    const deleteTeacher = (teacher) => {
        Swal.fire({
            title: `Hapus Guru "${teacher.user.name}"?`,
            text: "Data guru akan dihapus permanen dari sistem.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            backdrop: `
                rgba(0,0,0,0.7)
                url("/images/alert-trash.gif")
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
                destroy(route('teachers.destroy', teacher.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data guru berhasil dihapus.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'dark:bg-gray-800 dark:text-white'
                        }
                    })
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Guru" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center">
                                <AcademicCapIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 mr-3" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Guru</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Kelola data guru dan peran mereka dalam sistem
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative flex-grow sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Cari guru..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                                
                                <Link 
                                    href={route('teachers.create')} 
                                    className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                                >
                                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                                    Tambah Guru
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center">
                                <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                            </div>
                            
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                >
                                    {ROLE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronUpDownIcon className="w-5 h-5 absolute right-2 top-2 text-gray-400 pointer-events-none" />
                            </div>
                            
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronUpDownIcon className="w-5 h-5 absolute right-2 top-2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                Nama Guru
                                                <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Peran
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredTeachers.length > 0 ? filteredTeachers.map((teacher) => (
                                        <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-300 font-medium">
                                                        {teacher.user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {teacher.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {teacher.address || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {teacher.user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {teacher.roles && teacher.roles.length > 0 ? (
                                                        teacher.roles.map(role => (
                                                            <span 
                                                                key={role} 
                                                                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}
                                                            >
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Belum ada peran</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link 
                                                        href={route('teachers.show', teacher.id)} 
                                                        className="p-1.5 rounded-lg text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                                                        title="Detail"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <Link 
                                                        href={route('teachers.edit', teacher.id)} 
                                                        className="p-1.5 rounded-lg text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteTeacher(teacher)} 
                                                        className="p-1.5 rounded-lg text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12">
                                                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Belum ada data guru</h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Mulai dengan menambahkan guru baru.
                                                </p>
                                                <div className="mt-6">
                                                    <Link
                                                        href={route('teachers.create')}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                    >
                                                        <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                                                        Tambah Guru
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {teachers.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                                <Pagination links={teachers.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}