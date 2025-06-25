import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";

// Komponen kecil untuk baris nilai agar tidak berulang
const NilaiRow = ({ no, mapel, nilai, predikat }) => (
    <tr>
        <td className="border p-2 text-center">{no}</td>
        <td className="border p-2">{mapel}</td>
        <td className="border p-2 text-center">{nilai}</td>
        <td className="border p-2 text-center">{predikat}</td>
    </tr>
);

export default function Show({ auth, reportCard }) {
    // Fungsi sederhana untuk menentukan predikat berdasarkan nilai
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
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Detail Rapor Santri
                </h2>
            }
        >
            <Head title={`Rapor ${reportCard.santri.nama_santri_santri}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Tombol Aksi */}
                        <div className="p-6 flex justify-end items-center">
                            <a
                                href={route(
                                    "report-cards.download",
                                    reportCard.id
                                )}
                                className="btn btn-error text-white"
                                target="_blank" // Buka di tab baru
                                rel="noopener noreferrer"
                            >
                                Download PDF
                            </a>
                        </div>

                        {/* Konten Rapor */}
                        <div
                            className="p-6 md:p-10 text-gray-900 dark:text-gray-100"
                            id="report-card-content"
                        >
                            {/* ======================= KOP SURAT ======================= */}
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold">
                                    LAPORAN HASIL BELAJAR SANTRI
                                </h3>
                                <h4 className="text-xl font-semibold">
                                    MA'HAD SALMAN AL-FARISI
                                </h4>
                                <p>
                                    Tahun Ajaran:{" "}
                                    {reportCard.academic_year.year} - Semester{" "}
                                    {reportCard.academic_year.semester}
                                </p>
                            </div>

                            {/* ======================= DATA DIRI ======================= */}
                            <table className="w-full mb-8 text-sm">
                                <tbody>
                                    <tr>
                                        <td className="py-1 w-1/4">
                                            Nama Santri
                                        </td>
                                        <td className="w-1/2">
                                            :{" "}
                                            <span className="font-semibold">
                                                {
                                                    reportCard.santri
                                                        .nama_santri_santri
                                                }
                                            </span>
                                        </td>
                                        <td
                                            className="w-1/4"
                                            rowSpan={3}
                                            align="right"
                                        >
                                            {/* Foto santri bisa ditambahkan di sini jika ada */}
                                            {reportCard.santri.foto_santri ? (
                                                <img
                                                    src={`/storage/${reportCard.santri.foto_santri}`}
                                                    alt="Foto Santri"
                                                    className="w-20 h-24 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-20 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs">
                                                    Foto
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-1">
                                            Nomor Induk Santri
                                        </td>
                                        <td>
                                            :{" "}
                                            <span className="font-semibold">
                                                {reportCard.santri.nis}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-1">Kelas</td>
                                        <td>
                                            :{" "}
                                            <span className="font-semibold">
                                                {reportCard.kelas.nama_kelas}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ======================= NILAI AKADEMIK (DURUS) ======================= */}
                            <h3 className="text-lg font-bold mb-2 text-teal-600 dark:text-teal-400">
                                A. NILAI PELAJARAN (DURUS)
                            </h3>
                            <table className="w-full border border-collapse border-gray-300 dark:border-gray-600 text-sm">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                                        <th className="border p-2 w-[5%]">
                                            No
                                        </th>
                                        <th className="border p-2 text-left">
                                            Mata Pelajaran
                                        </th>
                                        <th className="border p-2 w-[15%]">
                                            Nilai
                                        </th>
                                        <th className="border p-2 w-[15%]">
                                            Predikat
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportCard.academic_scores.map(
                                        (score, index) => (
                                            <NilaiRow
                                                key={score.id}
                                                no={index + 1}
                                                mapel={score.mapel.nama_mapel} // Asumsi ada relasi `mapel` di model Akademik
                                                nilai={score.nilai}
                                                predikat={getPredikat(
                                                    score.nilai
                                                )}
                                            />
                                        )
                                    )}
                                    {reportCard.academic_scores.length ===
                                        0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center p-4"
                                            >
                                                Belum ada nilai akademik yang
                                                diinput.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* ======================= NILAI HAFALAN ======================= */}
                            <h3 className="text-lg font-bold mt-8 mb-2 text-teal-600 dark:text-teal-400">
                                B. NILAI HAFALAN AL-QUR'AN
                            </h3>
                            <table className="w-full border border-collapse border-gray-300 dark:border-gray-600 text-sm">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                                        <th className="border p-2 w-[5%]">
                                            No
                                        </th>
                                        <th className="border p-2 text-left">
                                            Keterangan Hafalan
                                        </th>
                                        <th className="border p-2 w-[15%]">
                                            Nilai
                                        </th>
                                        <th className="border p-2 w-[15%]">
                                            Predikat
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportCard.hafalan_scores.map(
                                        (score, index) => (
                                            <NilaiRow
                                                key={score.id}
                                                no={index + 1}
                                                mapel={`Juz ${score.juz} - Hal ${score.halaman}`}
                                                nilai={score.nilai}
                                                predikat={getPredikat(
                                                    score.nilai
                                                )}
                                            />
                                        )
                                    )}
                                    {reportCard.hafalan_scores.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center p-4"
                                            >
                                                Belum ada nilai hafalan yang
                                                diinput.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* ======================= KEHADIRAN & CATATAN ======================= */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-sm">
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-teal-600 dark:text-teal-400">
                                        C. KEHADIRAN
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 w-1/2">
                                                    Sakit
                                                </td>
                                                <td>
                                                    :{" "}
                                                    {reportCard.attendance
                                                        ?.sick ?? 0}{" "}
                                                    hari
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 w-1/2">
                                                    Izin
                                                </td>
                                                <td>
                                                    :{" "}
                                                    {reportCard.attendance
                                                        ?.permission ?? 0}{" "}
                                                    hari
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 w-1/2">
                                                    Tanpa Keterangan
                                                </td>
                                                <td>
                                                    :{" "}
                                                    {reportCard.attendance
                                                        ?.absent ?? 0}{" "}
                                                    hari
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-teal-600 dark:text-teal-400">
                                        D. CATATAN WALI KELAS
                                    </h3>
                                    <p className="border p-2 rounded min-h-[80px] border-gray-300 dark:border-gray-600">
                                        {reportCard.teacher_notes ||
                                            "Tidak ada catatan."}
                                    </p>
                                </div>
                            </div>

                            {/* ======================= TANDA TANGAN ======================= */}
                            <div className="flex justify-between items-end mt-16 pt-8 text-sm">
                                <div className="text-center">
                                    <p>Mengetahui,</p>
                                    <p>Orang Tua/Wali Santri</p>
                                    <div className="h-16"></div>
                                    <p className="font-semibold border-b border-gray-700 dark:border-gray-300">
                                        (................................)
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p>
                                        Grogol,{" "}
                                        {new Date().toLocaleDateString(
                                            "id-ID",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                    <p>Wali Kelas</p>
                                    <div className="h-16"></div>
                                    <p className="font-semibold border-b border-gray-700 dark:border-gray-300">
                                        (................................)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
