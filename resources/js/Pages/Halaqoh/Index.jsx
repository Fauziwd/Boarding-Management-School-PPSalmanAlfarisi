import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { BookOpenIcon, PlusCircleIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, halaqohs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        <BookOpenIcon className="w-6 h-6 inline-block mr-2" />
                        Manajemen Halaqoh
                    </h2>
                    <Link href={route('halaqohs.create')} className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-500">
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Buat Halaqoh
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Halaqoh" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nama Halaqoh</th>
                                        <th scope="col" className="px-6 py-3">Muhafidz</th>
                                        <th scope="col" className="px-6 py-3">Tahun Ajaran</th>
                                        <th scope="col" className="px-6 py-3 text-center">Jumlah Anggota</th>
                                        <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {halaqohs.data.map((halaqoh) => (
                                        <tr key={halaqoh.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">{halaqoh.name}</td>
                                            <td className="px-6 py-4">{halaqoh.teacher?.user?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{halaqoh.academic_year.year} ({halaqoh.academic_year.semester})</td>
                                            <td className="px-6 py-4 text-center">{halaqoh.santris_count}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Link href={route('halaqohs.show', halaqoh.id)} className="font-medium text-green-600 hover:underline mx-1">
                                                    <EyeIcon className="w-5 h-5 inline-block"/>
                                                </Link>
                                                <Link href={route('halaqohs.destroy', halaqoh.id)} method="delete" as="button" onBefore={() => confirm('Hapus kelompok ini?')} className="font-medium text-red-600 hover:underline mx-1">
                                                    <TrashIcon className="w-5 h-5 inline-block"/>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6">
                            <Pagination links={halaqohs.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
