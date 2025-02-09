import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Akademik({ akademiks }) {
    // Urutkan data akademik berdasarkan tanggal terbaru
    const sortedAkademiks = akademiks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Fungsi untuk menghitung rentang waktu antara dua tanggal
    const calculateTimeDifference = (currentDate, previousDate) => {
        const current = new Date(currentDate);
        const previous = new Date(previousDate);
        const diffTime = Math.abs(current - previous);

        // Hitung hari, jam, menit, dan detik
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
            (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
            (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        return `${diffDays} hari ${diffHours} jam ${diffMinutes} menit ${diffSeconds} detik`;
    };

    return (
        <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
           <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold">Pencapaian Akademik</h2>
    <Link
        href={route("akademik.create")}
         className="dark:hover:bg-gray-800 hover:bg-indigo-100 border rounded-md border-gray-500 text-indigo-800 dark:text-white font-bold py-2 px-4"
    >
        Tambah Akademik
    </Link>
</div>

            {sortedAkademiks.length === 0 ? (
                <div className="text-center">
                    <img
                        src="/img/empty.png" // Ganti dengan URL ilustrasi Anda
                        alt="Ilustrasi Sekolah"
                        className="w-70 h-64 mx-auto mt-4"
                        draggable="false"
                    />
                    <p className="text-gray-500 dark:text-white">
                        Belum ada data pencapaian akademik.
                    </p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-md overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium rounded-tl-xl bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Kitab
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Bab
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Tanggal
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium rounded-tr-xl bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Waktu
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-600 dark:divide-gray-700">
                        {sortedAkademiks.map((akademik, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {akademik.kitab}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {akademik.bab}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {new Date(
                                        akademik.created_at
                                    ).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {index < sortedAkademiks.length - 1
                                        ? calculateTimeDifference(
                                              akademik.created_at,
                                              sortedAkademiks[index + 1]
                                                  .created_at
                                          )
                                        : "Bidayah"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
