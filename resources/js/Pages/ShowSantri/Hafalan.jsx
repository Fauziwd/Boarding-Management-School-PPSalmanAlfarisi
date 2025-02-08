import React from "react";

export default function Hafalan({ hafalans }) {
    // Urutkan data hafalan berdasarkan tanggal terbaru
    const sortedHafalans = hafalans.sort(
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
        <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pencapaian Hafalan</h2>
            {sortedHafalans.length === 0 ? (
                <div className="text-center">
                    <img
                        src="/img/empty.png" // Ganti dengan URL ilustrasi Anda
                        alt="Ilustrasi Sekolah"
                        className="w-70 h-64 mx-auto mt-4"
                        draggable="false"
                    />
                    <p className="text-gray-500">
                        Belum ada data pencapaian akademik.
                    </p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-md overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium rounded-tl-xl bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Juz
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-indigo-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                Bulan
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
                        {sortedHafalans.map((hafalan, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {hafalan.juz}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {hafalan.month}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {new Date(
                                        hafalan.created_at
                                    ).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {index < sortedHafalans.length - 1
                                        ? calculateTimeDifference(
                                              hafalan.created_at,
                                              sortedHafalans[index + 1]
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
