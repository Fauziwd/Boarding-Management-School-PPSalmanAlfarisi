import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Chart from 'react-apexcharts';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FiBookOpen, FiEdit2, FiPlus, FiTrendingUp } from "react-icons/fi";

// Helper function untuk mengubah '1B' -> 2, '4A' -> 7, dst.
const convertHalamanToValue = (halaman) => {
    if (!halaman || !/(\d{1,2})([AB])/i.test(halaman)) return 0;
    const matches = halaman.match(/(\d{1,2})([AB])/i);
    return ((parseInt(matches[1], 10) - 1) * 2) + (matches[2].toUpperCase() === 'A' ? 1 : 2);
};

// Komponen Grafik Peningkatan Hafalan
const HafalanChart = ({ hafalans }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    
    const chartData = useMemo(() => {
        if (!hafalans || hafalans.length === 0) return [];
        
        // 1. Urutkan data berdasarkan tanggal setoran
        const sortedData = [...hafalans].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // 2. Hitung total halaman absolut untuk setiap setoran
        const dataWithTotalPages = sortedData.map(item => ({
            date: parseISO(item.created_at),
            totalPages: ((item.juz - 1) * 20) + convertHalamanToValue(item.halaman),
        }));

        // 3. Kelompokkan berdasarkan bulan dan ambil nilai tertinggi per bulan
        const monthlyMaxPages = dataWithTotalPages.reduce((acc, item) => {
            const monthKey = format(item.date, 'yyyy-MM');
            if (!acc[monthKey] || item.totalPages > acc[monthKey]) {
                acc[monthKey] = item.totalPages;
            }
            return acc;
        }, {});

        // 4. Hitung peningkatan (progress) antar bulan
        const months = Object.keys(monthlyMaxPages).sort();
        let lastMonthTotal = 0;
        return months.map(monthKey => {
            const currentMonthTotal = monthlyMaxPages[monthKey];
            const progress = currentMonthTotal - lastMonthTotal;
            lastMonthTotal = currentMonthTotal;
            return {
                x: format(parseISO(`${monthKey}-01`), 'MMM yy'),
                y: progress,
            };
        });
    }, [hafalans]);

    const chartOptions = {
        chart: { type: 'bar', height: 300, toolbar: { show: false }, background: 'transparent' },
        plotOptions: { bar: { horizontal: false, columnWidth: '60%', endingShape: 'rounded' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        series: [{ name: "Peningkatan Halaman", data: chartData }],
        colors: ["#38B2AC"],
        xaxis: { type: 'category', labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } } },
        yaxis: { title: { text: "Jumlah Halaman", style: { color: theme === 'dark' ? '#a0aec0' : '#4a5568' } }, labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } } },
        grid: { borderColor: theme === 'dark' ? "#2d3748" : "#e0e6ed" },
        tooltip: { theme: theme, y: { formatter: (val) => `${val} Halaman` } },
    };

    return (
        <div className="h-full w-full">
            <Chart options={chartOptions} series={chartOptions.series} type="bar" height="100%" />
        </div>
    );
};

// Komponen Utama Halaman
export default function Hafalan({ hafalans, santriId }) {
    const sortedHafalansForList = useMemo(() => {
        if (!hafalans) return [];
        return [...hafalans].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [hafalans]);
    
    const formatDisplayDate = (dateString) => {
        try {
            return format(parseISO(dateString), 'd MMMM yyyy', { locale: idLocale });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Head title="Pencapaian Hafalan" />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiBookOpen className="mr-3 text-teal-500"/>
                    Riwayat & Progres Hafalan
                </h2>
                <Link
                    href={route("hafalan.create", { santri_id: santriId })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 active:bg-teal-800 transition ease-in-out duration-150"
                >
                    <FiPlus/> Tambah Setoran
                </Link>
            </div>

            {!hafalans || hafalans.length === 0 ? (
                <div className="text-center py-16">
                    <FiBookOpen className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Belum Ada Data Hafalan</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mulai catat pencapaian hafalan santri.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white flex items-center"><FiTrendingUp className="mr-2 text-teal-500"/>Peningkatan per Bulan</h3>
                        <HafalanChart hafalans={hafalans} />
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Detail Setoran</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {sortedHafalansForList.map((hafalan) => (
                                <div key={hafalan.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">Juz {hafalan.juz} - Hal. {hafalan.halaman}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDisplayDate(hafalan.created_at)}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className="font-bold text-teal-600 dark:text-teal-300">{hafalan.nilai}</span>
                                        <Link href={route('hafalan.edit', hafalan.id)} className="p-2 text-gray-400 hover:text-blue-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                            <FiEdit2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
