import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Chart from 'react-apexcharts';
import { format, parse } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FiBookOpen, FiEdit2, FiPlus, FiTrendingUp } from "react-icons/fi";

// Komponen Grafik dengan APEXCHARTS
const HafalanChart = ({ hafalans }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Listener untuk perubahan tema dark/light
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    
    // ** ALGORITMA UTAMA YANG DIPERBAIKI **
    const chartData = useMemo(() => {
        if (!hafalans || hafalans.length === 0) return [];
        
        // 1. Urutkan data berdasarkan bulan yang diinput ("YYYY-MM")
        const sortedData = [...hafalans].sort((a, b) => a.month.localeCompare(b.month));

        // 2. Hitung progres kumulatif
        let cumulativeJuz = 0;
        const monthlyProgress = sortedData.reduce((acc, item) => {
            cumulativeJuz += 1;
            acc[item.month] = cumulativeJuz;
            return acc;
        }, {});
        
        // 3. Format data untuk ApexCharts
        return Object.keys(monthlyProgress).sort().map(key => ({
            x: format(parse(key, 'yyyy-MM', new Date()), 'MMM yy'), // Label X: "Jul 25"
            y: monthlyProgress[key] // Nilai Y: Jumlah kumulatif
        }));
    }, [hafalans]);

    const chartOptions = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'linear',
                speed: 800,
                animateGradually: { enabled: true, delay: 150 }
            }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        series: [{
            name: "Total Juz Tercapai",
            data: chartData,
        }],
        colors: ["#38B2AC"], // Warna Teal
        fill: {
            type: "gradient",
            gradient: {
                shade: theme === 'dark' ? 'dark' : 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 100],
            },
        },
        xaxis: {
            type: 'category',
            labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } },
            min: 0,
            tickAmount: 5,
            title: { text: "Jumlah Juz", style: { color: theme === 'dark' ? '#a0aec0' : '#4a5568', fontWeight: 400 } }
        },
        grid: {
            borderColor: theme === 'dark' ? "#2d3748" : "#e0e6ed",
            strokeDashArray: 4
        },
        tooltip: {
            theme: theme,
            x: { show: true },
        },
    };

    return (
        <div className="h-full w-full">
            <Chart options={chartOptions} series={chartOptions.series} type="area" height="100%" />
        </div>
    );
};


export default function Hafalan({ hafalans, santriId }) {

    // Urutkan data hafalan berdasarkan bulan terbaru untuk tampilan daftar riwayat
    const sortedHafalansForList = useMemo(() => {
        if (!hafalans) return [];
        return [...hafalans].sort((a, b) => b.month.localeCompare(a.month));
    }, [hafalans]);
    
    const formatDisplayDate = (monthString) => {
        try {
            const date = parse(monthString, 'yyyy-MM', new Date());
            return format(date, 'MMMM yyyy', { locale: idLocale });
        } catch (e) {
            return monthString;
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                    <FiPlus/> Tambah
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
                    {/* Grafik di sisi kiri */}
                    <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white flex items-center"><FiTrendingUp className="mr-2 text-teal-500"/>Progres Kumulatif</h3>
                        <HafalanChart hafalans={hafalans} />
                    </div>

                    {/* Daftar Riwayat di sisi kanan */}
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Detail Setoran</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {sortedHafalansForList.map((hafalan) => (
                                <div key={hafalan.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">Juz {hafalan.juz}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDisplayDate(hafalan.month)}</p>
                                    </div>
                                    <Link href={route('hafalan.edit', hafalan.id)} className="p-2 text-gray-400 hover:text-blue-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <FiEdit2 className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

