import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import { FiBookOpen, FiPlus, FiChevronRight, FiX, FiList, FiEdit2 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Komponen untuk Panel Detail Hafalan
const DetailPanel = ({ santri, onClose }) => {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(route('api.hafalans.getBySantriId', { santriId: santri.id }))
            .then(response => {
                setDetails(response.data);
            })
            .catch(error => console.error("Error fetching hafalan details:", error))
            .finally(() => setLoading(false));
    }, [santri]);

    const formatMonth = (dateString) => {
        if (!dateString) return 'N/A';
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
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
                        <div className="mb-6">
                            <Link 
                                href={route("hafalan.create", { santri_id: santri.id })} 
                                className="inline-flex items-center gap-2 w-full justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all"
                            >
                                <FiPlus /> Tambah Setoran untuk {santri.nama_santri}
                            </Link>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center"><FiList className="mr-2 text-teal-500"/>Riwayat Setoran</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-2">Bulan</th>
                                            <th className="px-4 py-2 text-center">Juz</th>
                                            <th className="px-4 py-2">Halaman/Baris</th>
                                            <th className="px-4 py-2 text-center">Nilai</th>
                                            <th className="px-4 py-2 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-gray-300">
                                        {details.map(item => (
                                            <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-4 py-3">{formatMonth(item.month)}</td>
                                                <td className="px-4 py-3 text-center font-semibold">{item.juz}</td>
                                                <td className="px-4 py-3">{item.halaman || '-'}/{item.baris || '-'}</td>
                                                <td className="px-4 py-3 text-center text-teal-600 dark:text-teal-400 font-bold">{item.nilai}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link href={route('hafalan.edit', { hafalan: item.id })} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                                                        <FiEdit2 className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

// Komponen Utama Halaman Index
export default function HafalanIndex({ auth, hafalans }) {
    const [selectedSantri, setSelectedSantri] = useState(null);

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan" },
    ];

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
                                            <th scope="col" className="px-6 py-3">Setoran Terakhir</th>
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
