import React, { useState, useEffect, Fragment } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumbs from "../../Components/Breadcrumbs";
import { FiPlus, FiFilter, FiTrendingUp, FiX, FiLoader, FiBookOpen, FiAward, FiUserCheck, FiCalendar } from "react-icons/fi";
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// ==============================================================================
// Komponen Modal untuk Detail Riwayat Hafalan
// ==============================================================================
const HafalanHistoryModal = ({ isOpen, onClose, santri, history, isLoading }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 dark:text-white flex justify-between items-center">
                                    <span>Riwayat Setoran: {santri?.nama_santri}</span>
                                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </Dialog.Title>
                                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-40">
                                            <FiLoader className="animate-spin text-teal-500 w-8 h-8" />
                                        </div>
                                    ) : history.length > 0 ? (
                                        <ul className="space-y-4">
                                            {history.map((item, index) => (
                                                <li key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FiBookOpen className="w-5 h-5 text-teal-500" />
                                                            <span className="font-semibold text-gray-800 dark:text-gray-100">Juz {item.juz}, Halaman {item.halaman}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                            <FiAward className="w-4 h-4" />
                                                            <span>Nilai: {item.nilai}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 pl-8 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                                        <p className="flex items-center gap-2">
                                                            <FiCalendar className="w-3 h-3" />
                                                            <span>{format(new Date(item.created_at), "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: id })}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <FiUserCheck className="w-3 h-3" />
                                                            <span>Disetor kepada: {item.teacher?.user?.name || 'N/A'}</span>
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tidak ada riwayat setoran yang tercatat.</p>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// ==============================================================================
// Halaman Index Utama
// ==============================================================================
export default function HafalanIndex({ auth, hafalanSummary, filters = {}, success }) {
    const [filterPreset, setFilterPreset] = useState(filters.filter_preset || 'last_week');
    const [showCustom, setShowCustom] = useState(filters.filter_preset === 'custom');
    const [customDates, setCustomDates] = useState({ start_date: filters.start_date || '', end_date: filters.end_date || '' });
    
    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSantri, setSelectedSantri] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        if (success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: success,
                showConfirmButton: false,
                timer: 3000
            });
        }
    }, [success]);
    
    const handlePresetChange = (e) => {
        const preset = e.target.value;
        setFilterPreset(preset);
        if (preset === 'custom') {
            setShowCustom(true);
        } else {
            setShowCustom(false);
            router.get(route("hafalan.index"), { filter_preset: preset }, { preserveState: true, replace: true });
        }
    };

    const handleCustomDateChange = (e) => {
        setCustomDates(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyCustomFilter = () => {
        router.get(route("hafalan.index"), { filter_preset: 'custom', ...customDates }, { preserveState: true, replace: true });
    };

    // Fungsi untuk membuka modal dan mengambil data riwayat
    const handleRowClick = async (santri) => {
        setSelectedSantri(santri);
        setIsModalOpen(true);
        setIsLoadingHistory(true);
        try {
            const response = await axios.get(route('hafalan.history', { santri: santri.santri_id }));
            setHistoryData(response.data.history);
        } catch (error) {
            console.error("Gagal mengambil riwayat hafalan:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Gagal memuat riwayat.',
                text: error.response?.data?.message || 'Silakan cek koneksi Anda.',
                showConfirmButton: false,
                timer: 3000
            });
            setHistoryData([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };
    
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan" }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pencapaian Hafalan" />
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <FiTrendingUp className="text-teal-500" /> Laporan Progres Hafalan
                        </h1>
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <Link
                        href={route("hafalan.create")}
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <FiPlus size={18} /> Input Setoran
                    </Link>
                </div>
                
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 border dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label htmlFor="filter_preset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pilih Periode Laporan
                            </label>
                            <select
                                id="filter_preset"
                                value={filterPreset}
                                onChange={handlePresetChange}
                                className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                            >
                                <option value="last_week">1 Pekan Terakhir</option>
                                <option value="last_2_weeks">2 Pekan Terakhir</option>
                                <option value="last_month">1 Bulan Terakhir</option>
                                <option value="last_3_months">3 Bulan Terakhir</option>
                                <option value="custom">Pilih Tanggal Sendiri</option>
                            </select>
                        </div>
                        {showCustom && (
                            <>
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label>
                                    <input type="date" name="start_date" id="start_date" value={customDates.start_date} onChange={handleCustomDateChange} className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>
                                    <input type="date" name="end_date" id="end_date" value={customDates.end_date} onChange={handleCustomDateChange} className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
                                </div>
                                <button onClick={applyCustomFilter} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg">
                                    <FiFilter size={16} /> Terapkan
                                </button>
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {hafalanSummary.length > 0 ? (
                                    hafalanSummary.map((item) => (
                                        <tr key={item.santri_id} onClick={() => handleRowClick(item)} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={item.foto_url || `https://ui-avatars.com/api/?name=${item.nama_santri}&color=7F9CF5&background=EBF4FF`} alt="" />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.nama_santri}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{item.nis}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.start_hafalan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">{item.end_hafalan}</div>
                                                <div className="text-xs text-blue-500 font-semibold">{item.end_quarter_text}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-teal-600 dark:text-teal-400">{item.progress_text}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.last_update}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Tidak ada data setoran pada rentang tanggal yang dipilih.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <HafalanHistoryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                santri={selectedSantri} 
                history={historyData} 
                isLoading={isLoadingHistory}
            />

        </AuthenticatedLayout>
    );
}
