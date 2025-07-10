import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
    PencilIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

// Komponen Baris Nilai (disempurnakan dengan visual yang lebih baik)
const NilaiRow = ({ no, mapel, nilai, predikat, getPredikatColor }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <td className="border-t border-gray-200 dark:border-gray-700 p-3 text-center w-12">{no}</td>
        <td className="border-t border-gray-200 dark:border-gray-700 p-3 font-medium">{mapel}</td>
        <td className="border-t border-gray-200 dark:border-gray-700 p-3 text-center">
            <span className={`font-bold text-lg ${getPredikatColor(predikat).textColor}`}>
                {nilai}
            </span>
        </td>
        <td className="border-t border-gray-200 dark:border-gray-700 p-3 text-center">
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${getPredikatColor(predikat).bgColor}`}>
                {predikat}
            </span>
        </td>
    </tr>
);

// Komponen untuk menampilkan bagian rekap absensi
const AttendanceSummary = ({ attendance }) => {
    if (!attendance) {
        return <p className="text-gray-500 text-center italic py-4">Data absensi belum tersedia.</p>;
    }
    
    const items = [
        { label: "Hadir", value: attendance.hadir, color: "text-green-600 dark:text-green-400" },
        { label: "Sakit", value: attendance.sakit, color: "text-yellow-600 dark:text-yellow-400" },
        { label: "Izin", value: attendance.izin, color: "text-blue-600 dark:text-blue-400" },
        { label: "Alpa", value: attendance.alpa, color: "text-red-600 dark:text-red-400" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {items.map(item => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                    <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                </div>
            ))}
        </div>
    );
};


export default function ReportCardShow({ auth, reportCard }) {
     const { data, setData, post, processing, errors } = useForm({
        murobbi_note: reportCard.murobbi_note || '',
    });
    
     const handleNoteSubmit = (e) => {
        e.preventDefault();
        post(route('report-cards.add-note', reportCard.id));
    };


    // Fungsi helper untuk menentukan predikat dan warnanya, dipindahkan ke dalam komponen utama
    const getPredikat = (nilai) => {
        if (nilai >= 90) return "A"; // Mumtaz (Istimewa)
        if (nilai >= 80) return "B"; // Jayyid Jiddan (Sangat Baik)
        if (nilai >= 70) return "C"; // Jayyid (Baik)
        if (nilai >= 60) return "D"; // Maqbul (Cukup)
        return "E"; // Rasib (Kurang)
    };

    const getPredikatColor = (predikat) => {
        switch (predikat) {
            case "A": return { textColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' };
            case "B": return { textColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' };
            case "C": return { textColor: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' };
            case "D": return { textColor: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200' };
            case "E": return { textColor: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' };
            default: return { textColor: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' };
        }
    };

    // Mengambil data rekap absensi dari props
    const attendance = reportCard.attendance_summary;
    // Mengambil nama Murobbi (jika ada)
    const murobbiName = reportCard.murobbi?.user?.name || "..............................";

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
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div
                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl border border-gray-200 dark:border-gray-700"
                        id="report-card-content"
                    >
                        <div className="p-6 md:p-10 text-gray-900 dark:text-gray-100">
                            {/* Header Section */}
                            <div className="text-center mb-10">
                                <img src="/logo/logo.salman.png" alt="Logo Pondok" className="h-20 mx-auto mb-6" />
                                <h3 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400">
                                    LAPORAN HASIL BELAJAR SANTRI
                                </h3>
                                <h4 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-1">
                                    MA'HAD SALMAN AL-FARISI
                                </h4>
                                <p className="text-md font-medium text-gray-500 dark:text-gray-400 mt-4">
                                    Tahun Ajaran: {reportCard.academic_year.year} - Semester {reportCard.academic_year.semester}
                                </p>
                            </div>

                            {/* Student Information */}
                            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                                <div className="grid md:grid-cols-3 gap-6 items-center">
                                    <div className="md:col-span-2">
                                        <h4 className="flex items-center text-lg font-bold mb-4 text-teal-600 dark:text-teal-400 border-b-2 border-teal-200 dark:border-teal-800 pb-2">
                                            <UserCircleIcon className="w-6 h-6 mr-2" /> DATA SANTRI
                                        </h4>
                                        <dl className="grid grid-cols-3 gap-x-4 gap-y-2">
                                           <dt className="font-medium col-span-1">Nama Lengkap</dt><dd className="col-span-2">: {reportCard.santri.nama_santri}</dd>
                                           <dt className="font-medium col-span-1">Nomor Induk</dt><dd className="col-span-2">: {reportCard.santri.nis}</dd>
                                           <dt className="font-medium col-span-1">Kelas</dt><dd className="col-span-2">: {reportCard.santri?.kelas?.nama_kelas || 'Belum Diatur'}</dd>
                                        </dl>
                                    </div>
                                    <div className="flex justify-center md:justify-end">
                                        <img
                                            src={reportCard.santri.foto_url || `/img/default-avatar.png`}
                                            alt="Foto Santri"
                                            className="w-28 h-36 object-cover rounded-lg shadow-md border-4 border-white dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Sections Container */}
                            <div className="space-y-8">
                                {/* Academic & Hafalan Scores */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Academic */}
                                    <div>
                                        <h3 className="flex items-center text-lg font-bold mb-3 text-teal-600 dark:text-teal-400">
                                            <DocumentTextIcon className="w-6 h-6 mr-2" /> A. NILAI AKADEMIK (DURUS)
                                        </h3>
                                        <table className="w-full text-sm">
                                            <thead className="text-left bg-gray-100 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="p-2 w-12 text-center">No</th>
                                                    <th className="p-2">Mata Pelajaran</th>
                                                    <th className="p-2 w-20 text-center">Nilai</th>
                                                    <th className="p-2 w-24 text-center">Predikat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportCard.akademik_details && reportCard.akademik_details.length > 0 ? (
                                                    reportCard.akademik_details.map((score, index) => (
                                                        <NilaiRow key={score.id} no={index + 1} mapel={score.course?.name || 'N/A'} nilai={score.score} predikat={getPredikat(score.score)} getPredikatColor={getPredikatColor}/>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="text-center p-6 text-gray-500">Belum ada nilai akademik.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Hafalan */}
                                    <div>
                                        <h3 className="flex items-center text-lg font-bold mb-3 text-teal-600 dark:text-teal-400">
                                            <DocumentTextIcon className="w-6 h-6 mr-2" /> B. NILAI HAFALAN
                                        </h3>
                                        <table className="w-full text-sm">
                                            <thead className="text-left bg-gray-100 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="p-2 w-12 text-center">No</th>
                                                    <th className="p-2">Keterangan</th>
                                                    <th className="p-2 w-20 text-center">Nilai</th>
                                                    <th className="p-2 w-24 text-center">Predikat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportCard.hafalan_details && reportCard.hafalan_details.length > 0 ? (
                                                    reportCard.hafalan_details.map((score, index) => (
                                                        <NilaiRow key={score.id} no={index + 1} mapel={`Juz ${score.juz}`} nilai={score.score} predikat={getPredikat(score.score)} getPredikatColor={getPredikatColor} />
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="text-center p-6 text-gray-500">Belum ada nilai hafalan.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Attendance */}
                                <div>
                                    <h3 className="flex items-center text-lg font-bold mb-3 text-teal-600 dark:text-teal-400">
                                        <ClipboardDocumentCheckIcon className="w-6 h-6 mr-2" /> C. REKAPITULASI ABSENSI
                                    </h3>
                                    <AttendanceSummary attendance={attendance} />
                                </div>

                                {/* Murobbi Notes */}
                                {auth.user.teacher?.roles.includes('Murobbi') && (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-3 text-teal-600">Catatan dari Anda sebagai Murobbi</h3>
            <form onSubmit={handleNoteSubmit}>
                <textarea
                    value={data.murobbi_note}
                    onChange={(e) => setData('murobbi_note', e.target.value)}
                    className="w-full h-24 p-2 border rounded-md dark:bg-gray-700"
                />
                <InputError message={errors.murobbi_note} className="mt-2" />
                <PrimaryButton className="mt-2" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                </PrimaryButton>
            </form>
        </div>
    )}
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between items-start mt-16 pt-8 border-t border-dashed border-gray-300 dark:border-gray-600">
                                <div className="text-center w-1/3">
                                    <p className="mb-16">Orang Tua/Wali</p>
                                    <p className="font-medium border-t border-gray-400 pt-1">(..............................)</p>
                                </div>
                                <div className="text-center w-1/3">
                                    <p>Grogol, {new Date(reportCard.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                                    <p className="mb-16">Murobbi</p>
                                    <p className="font-bold border-t border-gray-400 pt-1">{murobbiName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}