import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Chart from "react-apexcharts";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FiBookOpen, FiEdit2, FiPlus, FiTrendingUp, FiLoader } from "react-icons/fi";
import axios from "axios";

const HafalanChart = ({ chartData }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const chartOptions = {
        chart: { type: "bar", height: 300, toolbar: { show: false }, background: "transparent" },
        plotOptions: { bar: { horizontal: false, columnWidth: "60%", borderRadius: 4 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        series: [{ name: "Peningkatan Halaman", data: chartData }],
        colors: ["#38B2AC"],
        xaxis: { 
            type: "category",
            labels: { style: { colors: theme === "dark" ? "#a0aec0" : "#4a5568" } } 
        },
        yaxis: { 
            title: { text: "Jumlah Halaman", style: { color: theme === "dark" ? "#a0aec0" : "#4a5568" } },
            labels: { style: { colors: theme === "dark" ? "#a0aec0" : "#4a5568" } } 
        },
        grid: { borderColor: theme === "dark" ? "#2d3748" : "#e0e6ed" },
        tooltip: { theme: theme, y: { formatter: (val) => `${val} Halaman` } },
    };

    return <Chart options={chartOptions} series={chartOptions.series} type="bar" height="100%" />;
};

export default function Hafalan({ santriId }) {
    const [hafalans, setHafalans] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!santriId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get(route("hafalan.history", { santri: santriId }))
            .then(response => {
                setHafalans(response.data.history || []);
                setChartData(response.data.chartData || []);
            })
            .catch(err => {
                console.error("Error fetching hafalan data:", err);
                setError("Gagal memuat data hafalan.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [santriId]);

    const formatDisplayDate = (dateString) => {
        try {
            return format(parseISO(dateString), "d MMMM yyyy", { locale: idLocale });
        } catch {
            return "Tanggal tidak valid";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[400px]">
                <FiLoader className="animate-spin h-12 w-12 text-teal-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Terjadi Kesalahan</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Head title="Pencapaian Hafalan" />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiBookOpen className="mr-3 text-teal-500" />
                    Riwayat & Progres Hafalan
                </h2>
                <Link
                    href={route("hafalan.create", { santri_id: santriId })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 active:bg-teal-800 transition ease-in-out duration-150"
                >
                    <FiPlus /> Tambah Setoran
                </Link>
            </div>

            {(hafalans.length === 0) ? (
                <div className="text-center py-16">
                    <FiBookOpen className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Belum Ada Data Hafalan</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mulai catat pencapaian hafalan santri.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white flex items-center">
                            <FiTrendingUp className="mr-2 text-teal-500" />Peningkatan Halaman per Periode
                        </h3>
                        <HafalanChart chartData={chartData} />
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Detail Setoran</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {hafalans.map((hafalan) => (
                                <div key={hafalan.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">Juz {hafalan.juz} - Hal. {hafalan.halaman}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDisplayDate(hafalan.created_at)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-teal-600 dark:text-teal-300">{hafalan.nilai}</span>
                                        <Link href={route("hafalan.edit", hafalan.id)} className="p-2 text-gray-400 hover:text-blue-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
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
