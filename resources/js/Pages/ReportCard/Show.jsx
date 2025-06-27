import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

// Enhanced NilaiRow component with visual improvements
const NilaiRow = ({ no, mapel, nilai, predikat }) => {
    const getColorForPredikat = (predikat) => {
        switch(predikat) {
            case 'A': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200';
            case 'B': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200';
            case 'C': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200';
            case 'D': return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200';
            case 'E': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
            <td className="border border-gray-200 dark:border-gray-700 p-3 text-center font-medium">{no}</td>
            <td className="border border-gray-200 dark:border-gray-700 p-3">{mapel}</td>
            <td className="border border-gray-200 dark:border-gray-700 p-3 text-center font-medium">
                <span className={`inline-block w-12 py-1 rounded-full ${getColorForPredikat(predikat)}`}>
                    {nilai}
                </span>
            </td>
            <td className="border border-gray-200 dark:border-gray-700 p-3 text-center font-bold">
                <span className={`inline-block w-8 py-1 rounded-full ${getColorForPredikat(predikat)}`}>
                    {predikat}
                </span>
            </td>
        </tr>
    );
};

export default function Show({ auth, reportCard }) {
    const getPredikat = (nilai) => {
        if (nilai >= 90) return "A";
        if (nilai >= 80) return "B";
        if (nilai >= 70) return "C";
        if (nilai >= 60) return "D";
        return "E";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Detail Rapor Santri
                    </h2>
                    <a
                        href={route("report-cards.download", reportCard.id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:from-red-500 hover:to-red-400 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 shadow-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download PDF
                    </a>
                </div>
            }
        >
            <Head title={`Rapor ${reportCard.santri.nama_santri}`} />

            <div className="py-6 sm:py-8">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl border border-gray-200 dark:border-gray-700">
                        {/* Report Card Content */}
                        <div
                            className="p-6 md:p-10 text-gray-900 dark:text-gray-100"
                            id="report-card-content"
                        >
                            {/* Header Section */}
                            <div className="text-center mb-10">
                                <div className="mb-4">
                                    <img 
                                        src="/logo/logo.salman.png" 
                                        alt="Logo Pondok" 
                                        className="h-16 mx-auto mb-10"
                                    />
                                    <h3 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400">
                                        LAPORAN HASIL BELAJAR SANTRI
                                    </h3>
                                    <h4 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-1">
                                        MA'HAD SALMAN AL-FARISI
                                    </h4>
                                </div>
                                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg inline-block">
                                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                        Tahun Ajaran: {reportCard.academic_year.year} - Semester {reportCard.academic_year.semester}
                                    </p>
                                </div>
                            </div>

                            {/* Student Information */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold mb-4 text-teal-600 dark:text-teal-400 border-b pb-2 border-gray-200 dark:border-gray-700">
                                            DATA SANTRI
                                        </h4>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 w-1/3 font-medium">Nama Santri</td>
                                                    <td className="py-2">: {reportCard.santri.nama_santri}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-medium">Nomor Induk</td>
                                                    <td className="py-2">: {reportCard.santri.nis}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-medium">Tahun ke</td>
                                                    <td className="py-2">: {reportCard.kelas.nama_kelas}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        {reportCard.santri.foto_url ? (
                                            <div className="relative">
                                                <img
                                                    src={reportCard.santri.foto_url}
                                                    alt="Foto Santri"
                                                    className="w-28 h-32 object-cover rounded-lg shadow-md border-2 border-white dark:border-gray-700"
                                                />
                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                                            </div>
                                        ) : (
                                            <div className="w-28 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm shadow-md">
                                                Foto Tidak Tersedia
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Academic Scores */}
                            <div className="mb-10">
                                <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400 border-b pb-2 border-gray-200 dark:border-gray-700">
                                    A. NILAI PELAJARAN (DURUS)
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                                                <th className="p-3 text-center w-16">No</th>
                                                <th className="p-3 text-left">Mata Pelajaran</th>
                                                <th className="p-3 text-center w-24">Nilai</th>
                                                <th className="p-3 text-center w-24">Predikat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportCard.academic_scores && reportCard.academic_scores.length > 0 ? (
                                                reportCard.academic_scores.map((score, index) => (
                                                    <NilaiRow
                                                        key={score.id}
                                                        no={index + 1}
                                                        mapel={score.mapel?.nama_mapel || 'N/A'}
                                                        nilai={score.nilai}
                                                        predikat={getPredikat(score.nilai)}
                                                    />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center p-6 text-gray-500 dark:text-gray-400">
                                                        Belum ada nilai akademik yang diinput.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Hafalan Scores */}
                            <div className="mb-10">
                                <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400 border-b pb-2 border-gray-200 dark:border-gray-700">
                                    B. NILAI HAFALAN AL-QUR'AN
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                                                <th className="p-3 text-center w-16">No</th>
                                                <th className="p-3 text-left">Keterangan Hafalan</th>
                                                <th className="p-3 text-center w-24">Nilai</th>
                                                <th className="p-3 text-center w-24">Predikat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportCard.hafalan_scores && reportCard.hafalan_scores.length > 0 ? (
                                                reportCard.hafalan_scores.map((score, index) => (
                                                    <NilaiRow
                                                        key={score.id}
                                                        no={index + 1}
                                                        mapel={`Juz ${score.juz} - Hal ${score.halaman || 'N/A'}`}
                                                        nilai={score.nilai}
                                                        predikat={getPredikat(score.nilai)}
                                                    />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center p-6 text-gray-500 dark:text-gray-400">
                                                        Belum ada nilai hafalan yang diinput.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Attendance and Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400 border-b pb-2 border-gray-200 dark:border-gray-700">
                                        C. KEHADIRAN
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                            <span className="font-medium">Sakit</span>
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                                {reportCard.attendance?.sick ?? 0} hari
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                            <span className="font-medium">Izin</span>
                                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                                                {reportCard.attendance?.permission ?? 0} hari
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                            <span className="font-medium">Tanpa Keterangan</span>
                                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                                                {reportCard.attendance?.absent ?? 0} hari
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400 border-b pb-2 border-gray-200 dark:border-gray-700">
                                        D. CATATAN MUROBBI
                                    </h3>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm min-h-[180px] border border-gray-200 dark:border-gray-700">
                                        {reportCard.teacher_notes ? (
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {reportCard.teacher_notes}
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                Tidak ada catatan dari wali kelas.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-center mb-8 md:mb-0">
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">Mengetahui,</p>
                                    <p className="font-medium mb-1">Orang Tua/Wali Santri</p>
                                    <div className="h-16 w-48 mx-auto border-b-2 border-gray-400 dark:border-gray-500"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        Grogol, {new Date().toLocaleDateString("id-ID", { 
                                            day: "2-digit", 
                                            month: "long", 
                                            year: "numeric" 
                                        })}
                                    </p>
                                    <p className="font-medium mb-1">MUROBBI</p>
                                    <div className="h-16 w-48 mx-auto border-b-2 border-gray-400 dark:border-gray-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}