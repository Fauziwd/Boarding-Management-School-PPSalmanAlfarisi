import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';
import { FiFileText, FiDownload, FiPlusCircle, FiPrinter, FiInfo } from 'react-icons/fi';

export default function ReportCardIndex({ auth, reportCards, activeYear, success }) {

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
    }, [success]);

    const handleGenerate = () => {
        Swal.fire({
            title: `Generate Rapor?`,
            text: `Ini akan membuat draf rapor untuk semua santri di semester aktif: ${activeYear.year} - ${activeYear.semester}. Lanjutkan?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Generate!',
            cancelButtonText: 'Batal',
            background: '#1f2937',
            color: '#f3f4f6',
            backdrop: 'rgba(0,0,0,0.7)'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('report-cards.generate'), {}, {
                    preserveScroll: true,
                });
            }
        })
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Data Rapor" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Data Rapor</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Kelola dan pantau perkembangan akademik santri melalui rapor
                            </p>
                        </div>
                        
                        {activeYear ? (
                            <button 
                                onClick={handleGenerate} 
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-medium py-3 px-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FiPlusCircle className="text-lg" /> 
                                <span>Generate Rapor Semester Aktif</span>
                            </button>
                        ) : (
                            <div className="flex items-start p-4 bg-amber-100/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-800 w-full md:w-auto">
                                <FiInfo className="flex-shrink-0 mt-0.5 mr-2 text-amber-600 dark:text-amber-300" />
                                <div>
                                    <p className="font-medium">Tidak ada Tahun Ajaran yang aktif</p>
                                    <p className="text-sm">Silakan aktifkan terlebih dahulu di menu Tahun Ajaran</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rapor</h3>
                            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{reportCards.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tahun Ajaran Aktif</h3>
                            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                                {activeYear ? `${activeYear.year} (${activeYear.semester})` : '-'}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kelas Tersedia</h3>
                            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                                {new Set(reportCards.data.map(report => report.kelas.nama_kelas)).size}
                            </p>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Santri</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIS</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tahun Ajaran</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {reportCards.data.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                                                        {report.santri.nama_santri.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{report.santri.nama_santri}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{report.santri.jenis_kelamin}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">{report.santri.nis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{report.academic_year.year}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{report.academic_year.semester}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                                    {report.kelas.nama_kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <Link 
                                                    href={route('report-cards.show', report.id)} 
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                                                    title="Lihat Detail"
                                                >
                                                    <FiFileText className="mr-1" /> Detail
                                                </Link>
                                                <a 
                                                    href={route('report-cards.download', report.id)} 
                                                    target="_blank" 
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                                                    title="Download PDF"
                                                >
                                                    <FiDownload className="mr-1" /> PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {reportCards.total === 0 && (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4">
                                    <FiFileText className="w-full h-full" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada data rapor</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {activeYear ? 'Klik tombol Generate untuk membuat rapor' : 'Aktifkan tahun ajaran terlebih dahulu'}
                                </p>
                            </div>
                        )}
                        
                        {reportCards.total > 0 && (
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan <span className="font-medium">{reportCards.from}</span> sampai <span className="font-medium">{reportCards.to}</span> dari <span className="font-medium">{reportCards.total}</span> rapor
                                </div>
                                <Pagination links={reportCards.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}