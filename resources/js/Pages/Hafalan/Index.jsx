import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import { FiBookOpen, FiPlus, FiChevronRight, FiX, FiTrendingUp, FiList, FiEdit2 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Chart from 'react-apexcharts'; // <-- Ganti import ke react-apexcharts
import { subMonths, format, parse, startOfMonth } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// Komponen Grafik dengan APEXCHARTS
const ProgressChart = ({ data }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Listener untuk perubahan tema
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    
    const chartOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent',
            // Konfigurasi animasi baru
            animations: {
                enabled: true,
                easing: 'linear',
                speed: 900,
                animateGradually: {
                    enabled: true,
                    delay: 250
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 5,
        },
        series: [{
            name: "Total Hafalan",
            data: data.map(d => d.juz_tercapai) 
        }],
        colors: ["#38B2AC"],
        fill: {
            type: "gradient",
            gradient: {
                shade: theme === 'dark' ? 'dark' : 'light',
                type: 'vertical',
                shadeIntensity: 0,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.9,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            type: 'category',
            categories: data.map(d => d.name),
            labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } },
            min: 0,
            tickAmount: 5
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
        <div className="h-64 w-full">
            <Chart options={chartOptions} series={chartOptions.series} type="area" height="100%" />
        </div>
    );
};

// Komponen Panel Detail dengan Logika yang Sama
const DetailPanel = ({ santri, onClose }) => {
    const [allDetails, setAllDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('12m');

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/hafalans/${santri.id}`)
            .then(response => {
                const sortedData = response.data.sort((a, b) => a.month.localeCompare(b.month));
                setAllDetails(sortedData);
            })
            .catch(error => console.error("Error fetching hafalan details:", error))
            .finally(() => setLoading(false));
    }, [santri]);
    
    const filteredData = useMemo(() => {
        if (!allDetails.length) return { chartData: [], listData: [] };
        const now = new Date();
        let startDate;

        switch (timeFilter) {
            case '1m': startDate = startOfMonth(subMonths(now, 1)); break;
            case '3m': startDate = startOfMonth(subMonths(now, 3)); break;
            case '6m': startDate = startOfMonth(subMonths(now, 6)); break;
            default: startDate = startOfMonth(subMonths(now, 12));
        }

        const listData = allDetails.filter(d => {
            const itemDate = parse(d.month, 'yyyy-MM', new Date());
            return itemDate >= startDate;
        });
        
        let cumulativeJuz = 0;
        const monthlyProgress = {};

        listData.forEach(item => {
            const monthKey = item.month;
            cumulativeJuz += 1;
            monthlyProgress[monthKey] = cumulativeJuz;
        });

        const chartData = Object.keys(monthlyProgress).sort().map(key => ({
            name: format(parse(key, 'yyyy-MM', new Date()), 'MMM yy'),
            juz_tercapai: monthlyProgress[key]
        }));

        return { chartData, listData };
    }, [allDetails, timeFilter]);

    const filterOptions = [
        { key: '1m', label: '1 Bulan' },
        { key: '3m', label: '3 Bulan' },
        { key: '6m', label: '6 Bulan' },
        { key: '12m', label: '1 Tahun' },
    ];
    
    const formatDisplayDate = (monthString) => {
        try {
            const date = parse(monthString, 'yyyy-MM', new Date());
            return format(date, 'MMMM yyyy', { locale: idLocale });
        } catch (e) {
            return monthString;
        }
    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-full lg:w-3/5 bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col"
        >
            <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Hafalan: {santri.nama_santri}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">NIS: {santri.nis}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <FiX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
            </header>
            
            <div className="flex-grow p-6 overflow-y-auto">
                {loading ? (
                     <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center"><FiTrendingUp className="mr-2 text-teal-500"/>Grafik Progres Hafalan</h3>
                                <div className="flex items-center gap-2">
                                    {filterOptions.map(opt => (
                                        <button 
                                            key={opt.key}
                                            onClick={() => setTimeFilter(opt.key)}
                                            className={`px-3 py-1 text-xs font-medium rounded-full transition ${timeFilter === opt.key ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                        >{opt.label}</button>
                                    ))}
                                </div>
                            </div>
                            <ProgressChart data={filteredData.chartData} />
                        </div>
                        
                        <div className="mb-6">
                             <Link href={route("hafalan.create", { santri_id: santri.id })} className="inline-flex items-center gap-2 w-full justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all">
                                <FiPlus /> Tambah Hafalan untuk {santri.nama_santri}
                            </Link>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center"><FiList className="mr-2 text-teal-500"/>Riwayat Setoran (Sesuai Filter)</h3>
                            <div className="space-y-3">
                                {filteredData.listData.length > 0 ? filteredData.listData.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/60">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">Juz {item.juz}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{formatDisplayDate(item.month)}</p>
                                            <Link href={route('hafalan.edit', item.id)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                                                <FiEdit2 className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 py-8">Tidak ada data setoran pada rentang waktu ini.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

// Komponen Utama Halaman Index (Tidak ada perubahan)
export default function HafalanIndex({ auth, hafalans }) {
    const [selectedSantri, setSelectedSantri] = useState(null);
    const breadcrumbs = [{ label: "Home", href: route("dashboard") }, { label: "Hafalan" }];
    const data = hafalans?.data || [];
    const links = hafalans?.links || [];
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pencapaian Hafalan Santri" />
            <div className="relative flex h-screen overflow-hidden">
                <motion.div 
                    animate={{ width: selectedSantri ? "40%" : "100%" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className={`h-full flex-shrink-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${selectedSantri ? 'hidden lg:block' : 'block w-full'}`}
                >
                    <div className="mx-auto max-w-full p-6 lg:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <FiBookOpen className="mr-3 text-teal-500" /> Pencapaian Hafalan
                                </h1>
                                <Breadcrumbs items={breadcrumbs} />
                            </div>
                            <Link href={route("hafalan.create")} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all">
                                <FiPlus /> Tambah
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Nama Santri</th>
                                            <th scope="col" className="px-6 py-3 text-center">Total Juz</th>
                                            <th scope="col" className="px-6 py-3">Terakhir Update</th>
                                            <th scope="col" className="px-6 py-3"><span className="sr-only">Detail</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(({ santri, total_juz, terakhir_update }) => (
                                            <tr key={santri.id} onClick={() => setSelectedSantri(santri)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-3">
                                                    <img src={santri.foto_url || `https://ui-avatars.com/api/?name=${santri.nama_santri}&background=teal&color=fff`} alt={santri.nama_santri} className="w-8 h-8 rounded-full object-cover" />
                                                    {santri.nama_santri}
                                                </th>
                                                <td className="px-6 py-4 text-center">{total_juz}</td>
                                                <td className="px-6 py-4">{new Date(terakhir_update).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <FiChevronRight className="h-5 w-5 text-teal-500" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                             {links && links.length > 3 && (
                                 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                     <Pagination links={links} />
                                 </div>
                             )}
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>
                    {selectedSantri && (
                        <DetailPanel santri={selectedSantri} onClose={() => setSelectedSantri(null)} />
                    )}
                </AnimatePresence>
            </div>
        </AuthenticatedLayout>
    );
}