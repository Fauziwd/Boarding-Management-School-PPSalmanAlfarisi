import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import axios from "axios";
import { FiPlus, FiFilter, FiTrendingUp, FiX, FiList, FiEdit2, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';
import Chart from 'react-apexcharts';

// Komponen untuk Panel Detail Riwayat Hafalan
const DetailPanel = ({ santri, onClose, onDataChange }) => {
    const [details, setDetails] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [period, setPeriod] = useState('monthly');
    const [customDates, setCustomDates] = useState({ start_date: '', end_date: '' });

    const fetchDetails = () => {
        setLoading(true);
        const params = { period };
        if (period === 'custom' && customDates.start_date && customDates.end_date) {
            params.start_date = customDates.start_date;
            params.end_date = customDates.end_date;
        }

        axios.get(route('hafalans.history', { santri: santri.santri_id, ...params }))
            .then(response => {
                const { history, chartData } = response.data;
                setDetails(history);
                setChartData(chartData);
            })
            .catch(error => {
                console.error("Error fetching details:", error);
                Swal.fire({ icon: 'error', title: 'Gagal Memuat Detail', text: 'Terjadi kesalahan saat mengambil data riwayat.' });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDetails();
    }, [santri]);

    useEffect(() => {
        if (period !== 'custom') {
            fetchDetails();
        }
    }, [period]);

    const handleCustomDateApply = () => {
        if (customDates.start_date && customDates.end_date) {
            fetchDetails();
        }
    };

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleDelete = (hafalanId) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Data setoran ini akan dihapus secara permanen!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal',
            customClass: { popup: 'dark:bg-gray-800 dark:text-gray-200' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('hafalan.destroy', hafalanId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Data berhasil dihapus.', showConfirmButton: false, timer: 2000 });
                        fetchDetails();
                        onDataChange();
                    },
                    onError: () => Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Gagal menghapus data.', showConfirmButton: false, timer: 2000 })
                });
            }
        });
    };

    const chartOptions = {
        chart: { type: 'bar', height: 250, toolbar: { show: false }, background: 'transparent' },
        plotOptions: { bar: { horizontal: false, columnWidth: '60%', endingShape: 'rounded' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        series: [{ name: "Peningkatan Halaman", data: chartData.map(d => d.y) }],
        colors: ["#38B2AC"],
        xaxis: { categories: chartData.map(d => d.x), labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } } },
        yaxis: { title: { text: 'Jumlah Halaman', style: { color: theme === 'dark' ? '#a0aec0' : '#4a5568' } }, labels: { style: { colors: theme === 'dark' ? "#a0aec0" : "#4a5568" } } },
        grid: { borderColor: theme === 'dark' ? "#2d3748" : "#e0e6ed" },
        tooltip: { theme: theme, y: { formatter: (val) => `${val} Halaman` } },
    };

    return (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute top-0 right-0 h-full w-full lg:w-3/5 bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col z-50">
            <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Riwayat Setoran: {santri.nama_santri}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">NIS: {santri.nis}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><FiX className="h-6 w-6 text-gray-600 dark:text-gray-300" /></button>
            </header>
            <div className="flex-grow p-6 overflow-y-auto">
                {loading ? <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div> : (
                    <>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Grafik Peningkatan</h3>
                                <select value={period} onChange={e => setPeriod(e.target.value)} className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                                    <option value="monthly">Bulanan</option>
                                    <option value="weekly">Mingguan</option>
                                    <option value="custom">Kustom</option>
                                </select>
                            </div>
                            {period === 'custom' && (
                                <div className="flex gap-2 mb-2">
                                    <input type="date" value={customDates.start_date} onChange={e => setCustomDates(p => ({...p, start_date: e.target.value}))} className="text-sm w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" />
                                    <input type="date" value={customDates.end_date} onChange={e => setCustomDates(p => ({...p, end_date: e.target.value}))} className="text-sm w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" />
                                    <button onClick={handleCustomDateApply} className="px-3 py-1 bg-teal-600 text-white rounded-md text-sm">OK</button>
                                </div>
                            )}
                            <Chart options={chartOptions} series={chartOptions.series} type="bar" height={250} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center"><FiList className="mr-2 text-teal-500"/>Daftar Setoran</h3>
                            <div className="space-y-3">
                                {details.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">Juz {item.juz}, Halaman {item.halaman}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="text-right mr-2"><p className="text-xs text-gray-500 dark:text-gray-400">Nilai</p><p className="font-bold text-xl text-teal-600 dark:text-teal-300">{item.nilai}</p></div>
                                                <Link href={route('hafalan.edit', item.id)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"><FiEdit2 className="h-4 w-4" /></Link>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition"><FiTrash2 className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                        {item.teacher && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t dark:border-gray-700">Disetor ke: {item.teacher.user.name}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

// Komponen Utama Halaman Index
export default function HafalanIndex({ auth, hafalanSummary, filters = {}, success }) {
    const [selectedSantri, setSelectedSantri] = useState(null);
    const [filterPreset, setFilterPreset] = useState(filters.filter_preset || 'last_week');
    const [showCustom, setShowCustom] = useState(filters.filter_preset === 'custom');
    const [customDates, setCustomDates] = useState({ start_date: filters.start_date || '', end_date: filters.end_date || '' });

    useEffect(() => { if (success) { Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: success, showConfirmButton: false, timer: 3000 }); } }, [success]);
    const handlePresetChange = (e) => {
        const preset = e.target.value;
        setFilterPreset(preset);
        if (preset === 'custom') { setShowCustom(true); } else { setShowCustom(false); router.get(route("hafalan.index"), { filter_preset: preset }, { preserveState: true, replace: true }); }
    };
    const handleCustomDateChange = (e) => { setCustomDates(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const applyCustomFilter = () => { router.get(route("hafalan.index"), { filter_preset: 'custom', ...customDates }, { preserveState: true, replace: true }); };
    const breadcrumbs = [{ label: "Home", href: route("dashboard") }, { label: "Hafalan" }];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pencapaian Hafalan" />
            <div className="relative flex h-screen overflow-hidden">
                <motion.div animate={{ width: selectedSantri ? "40%" : "100%" }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className={`h-full flex-shrink-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${selectedSantri ? 'hidden lg:block' : 'block w-full'}`}>
                    <div className="mx-auto max-w-full p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3"><FiTrendingUp className="text-teal-500" /> Laporan Progres Hafalan</h1>
                                <Breadcrumbs items={breadcrumbs} />
                            </div>
                            <Link href={route("hafalan.create")} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"><FiPlus size={18} /> Input Setoran</Link>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label htmlFor="filter_preset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Periode Laporan</label>
                                    <select id="filter_preset" value={filterPreset} onChange={handlePresetChange} className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white">
                                        <option value="last_week">1 Pekan Terakhir</option><option value="last_2_weeks">2 Pekan Terakhir</option><option value="last_month">1 Bulan Terakhir</option><option value="last_3_months">3 Bulan Terakhir</option><option value="custom">Pilih Tanggal Sendiri</option>
                                    </select>
                                </div>
                                {showCustom && (
                                    <>
                                        <div><label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label><input type="date" name="start_date" id="start_date" value={customDates.start_date} onChange={handleCustomDateChange} className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" /></div>
                                        <div><label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label><input type="date" name="end_date" id="end_date" value={customDates.end_date} onChange={handleCustomDateChange} className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" /></div>
                                        <button onClick={applyCustomFilter} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"><FiFilter size={16} /> Terapkan</button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Santri</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hafalan Awal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hafalan Akhir</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peningkatan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Setoran Terakhir</th>
                                            <th className="px-1 py-3"><span className="sr-only">Detail</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {hafalanSummary.length > 0 ? (
                                            hafalanSummary.map((item) => (
                                                <tr key={item.santri_id} onClick={() => setSelectedSantri(item)} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer">
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><img className="h-10 w-10 rounded-full object-cover" src={item.foto_url || `https://ui-avatars.com/api/?name=${item.nama_santri}&color=7F9CF5&background=EBF4FF`} alt="" /><div className="ml-4"><div className="text-sm font-semibold text-gray-900 dark:text-white">{item.nama_santri}</div><div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{item.nis}</div></div></div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.start_hafalan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-white font-medium">{item.end_hafalan}</div><div className="text-xs text-blue-500 font-semibold">{item.end_quarter_text}</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-teal-600 dark:text-teal-400">{item.progress_text}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.last_update}</td>
                                                    <td className="px-1 py-4"><FiChevronRight className="h-5 w-5 text-gray-400" /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Tidak ada data setoran pada rentang tanggal yang dipilih.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>
                    {selectedSantri && (
                        <DetailPanel santri={selectedSantri} onClose={() => setSelectedSantri(null)} onDataChange={() => router.reload({ only: ['hafalanSummary'] })} />
                    )}
                </AnimatePresence>
            </div>
        </AuthenticatedLayout>
    );
}
