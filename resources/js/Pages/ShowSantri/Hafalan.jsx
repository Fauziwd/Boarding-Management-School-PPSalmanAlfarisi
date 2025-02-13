import React, { useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import ApexCharts from 'apexcharts';

export default function Hafalan({ hafalans }) {
    // Urutkan data hafalan berdasarkan tanggal terbaru
    const sortedHafalans = hafalans.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
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

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const seriesData = sortedHafalans.map(hafalan => ({
                x: new Date(hafalan.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
                y: hafalan.juz
            }));

            const options = {
                chart: {
                    type: 'area',
                    height: 350,
                    toolbar: { show: false },
                },
                series: [
                    {
                        name: "Jumlah Hafalan",
                        data: seriesData,
                    },
                ],
                xaxis: {
                    type: 'category',
                    labels: { style: { colors: '#333' } },
                },
                yaxis: {
                    labels: { style: { colors: '#333' } },
                },
                tooltip: {
                    theme: 'light',
                },
                stroke: { width: 2 },
                dataLabels: { enabled: false },
                grid: {
                    borderColor: '#e7e7e7',
                },
            };

            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            return () => {
                chart.destroy();
            };
        }
    }, [sortedHafalans]);

    return (
        <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
            <Head title="Pencapaian Hafalan" />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Pencapaian Hafalan</h2>
                <Link
                    href={route("hafalan.create")}
                    className="dark:hover:bg-gray-800 hover:bg-indigo-100 border rounded-md border-gray-500 text-indigo-800 dark:text-white font-bold py-2 px-4"
                >
                    Tambah Hafalan
                </Link>
            </div>
            {sortedHafalans.length === 0 ? (
                <div className="text-center">
                    <img
                        src="/img/empty.png" // Ganti dengan URL ilustrasi Anda
                        alt="Ilustrasi Sekolah"
                        className="w-70 h-64 mx-auto mt-4"
                        draggable="false"
                    />
                    <p className="text-gray-500 dark:text-white">
                        Belum ada data pencapaian hafalan.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="chart" ref={chartRef} className="shadow-lg rounded-md overflow-hidden"></div>
                    <div className="shadow-lg rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                            {new Date(hafalan.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(hafalan.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                            {index === 0
                                                ? "Bidayah"
                                                : calculateTimeDifference(hafalan.created_at, sortedHafalans[index - 1].created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}