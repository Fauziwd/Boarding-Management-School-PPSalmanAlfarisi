import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { DocumentDuplicateIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ReportCardIndex({ auth, reportCards, activeYear }) {
    const { post, processing } = useForm({
        academic_year_id: activeYear?.id || '',
    });

    const generateReports = (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin men-generate rapor untuk semua santri di semester aktif? Proses ini tidak dapat dibatalkan.')) {
            post(route('report-cards.generate'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        <DocumentDuplicateIcon className="w-6 h-6 inline-block mr-2" />
                        Manajemen Rapor
                    </h2>
                    {activeYear && (
                        <form onSubmit={generateReports}>
                            <PrimaryButton disabled={processing}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {processing ? 'Memproses...' : `Generate Rapor Semester Ini`}
                            </PrimaryButton>
                        </form>
                    )}
                </div>
            }
        >
            <Head title="Manajemen Rapor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {!activeYear && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                            <p className="font-bold">Perhatian</p>
                            <p>Tidak ada tahun ajaran yang aktif. Silakan aktifkan satu tahun ajaran untuk bisa men-generate rapor.</p>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nama Santri</th>
                                        <th scope="col" className="px-6 py-3">NIS</th>
                                        <th scope="col" className="px-6 py-3">Kelas</th>
                                        <th scope="col" className="px-6 py-3">Tahun Ajaran</th>
                                        <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportCards.data.length > 0 ? (
                                        reportCards.data.map((reportCard) => (
                                            <tr key={reportCard.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {reportCard.santri?.nama_santri || 'Santri Dihapus'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {reportCard.santri?.nis || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* PERBAIKAN: Menggunakan relasi langsung dan optional chaining */}
                                                    <span className="px-2 py-1 font-semibold leading-tight text-teal-700 bg-teal-100 rounded-full dark:bg-teal-700 dark:text-teal-100">
                                                        {reportCard.kelas?.nama_kelas || 'Belum Diatur'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {reportCard.academic_year?.year} - {reportCard.academic_year?.semester}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link href={route('report-cards.show', reportCard.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1" title="Lihat Detail Rapor">
                                                        <EyeIcon className="w-5 h-5 inline-block"/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center p-6 text-gray-500">
                                                Belum ada rapor yang digenerate.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {reportCards.data.length > 0 && <Pagination links={reportCards.links} />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
