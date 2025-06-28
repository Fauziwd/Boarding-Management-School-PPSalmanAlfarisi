import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import { FiBook, FiPlus, FiChevronRight, FiX, FiList, FiEdit2, FiMessageSquare } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Komponen untuk Panel Detail (Grafik Dihilangkan)
const DetailPanel = ({ santri, onClose }) => {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/akademiks/${santri.id}`)
            .then(response => {
                setDetails(response.data);
            })
            .catch(error => console.error("Error fetching details:", error))
            .finally(() => setLoading(false));
    }, [santri]);

    // Fungsi untuk menentukan warna baris berdasarkan status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Tamat':
                return 'bg-gray-200 dark:bg-gray-700'; // Abu-abu
            case 'Ikhtibar':
                return 'bg-teal-100 dark:bg-teal-900/40'; // Toska (Teal)
            default:
                return 'bg-white dark:bg-gray-800/50'; // Default
        }
    };
    
    // Fungsi untuk mendapatkan teks warna berdasarkan status
    const getStatusTextColor = (status) => {
        switch (status) {
            case 'Tamat':
                return 'text-gray-800 dark:text-gray-200';
            case 'Ikhtibar':
                return 'text-teal-800 dark:text-teal-200';
            default:
                return 'text-gray-800 dark:text-white';
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Pencapaian: {santri.nama_santri}</h2>
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
                                href={route("akademik.create", { santri_id: santri.id })} 
                                className="inline-flex items-center gap-2 w-full justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all"
                            >
                                <FiPlus /> Tambah Pencapaian untuk {santri.nama_santri}
                            </Link>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center"><FiList className="mr-2 text-teal-500"/>Riwayat Pencapaian</h3>
                            <div className="space-y-3">
                                {details.map(item => (
                                    // PERBAIKAN: Layout item diubah untuk mengakomodasi nilai & catatan
                                    <div key={item.id} className={`p-4 rounded-lg shadow-sm transition-all hover:shadow-md ${getStatusClass(item.status)}`}>
                                        <div className="flex items-start justify-between">
                                            {/* Info Kitab & Bab */}
                                            <div>
                                                <p className={`font-semibold ${getStatusTextColor(item.status)}`}>{item.kitab}</p>
                                                <p className={`text-sm ${getStatusTextColor(item.status)} opacity-80`}>{item.bab}</p>
                                            </div>
                                            {/* Info Status, Nilai, & Aksi */}
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                                {/* Menampilkan Nilai jika ada */}
                                                {item.nilai && (
                                                     <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Nilai</p>
                                                        <p className="font-bold text-xl text-teal-600 dark:text-teal-300">{item.nilai}</p>
                                                    </div>
                                                )}
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusTextColor(item.status)} border border-current`}>
                                                    {item.status}
                                                </span>
                                                <Link href={route('akademik.edit', item.id)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                                                    <FiEdit2 className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                        {/* Menampilkan Catatan jika ada */}
                                        {item.catatan && (
                                            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700/50">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                    <FiMessageSquare className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                                    <span className="italic">"{item.catatan}"</span>
                                                </p>
                                            </div>
                                        )}
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
export default function AkademikIndex({ auth, akademiks }) {
    const [selectedSantri, setSelectedSantri] = useState(null);

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Akademik" },
    ];

    const data = akademiks?.data || [];
    const links = akademiks?.links || [];
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pencapaian Akademik Santri" />
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
                                    <FiBook className="mr-3 text-teal-500" /> Pencapaian Akademik
                                </h1>
                                <Breadcrumbs items={breadcrumbs} />
                            </div>
                            <Link href={route("akademik.create")} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all">
                                <FiPlus /> Tambah
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Nama Santri</th>
                                            <th scope="col" className="px-6 py-3 text-center">Jumlah Kitab</th>
                                            <th scope="col" className="px-6 py-3">Terakhir Update</th>
                                            <th scope="col" className="px-6 py-3"><span className="sr-only">Detail</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(({ santri, jumlah_kitab, terakhir_update }) => (
                                            <tr key={santri.id} onClick={() => setSelectedSantri(santri)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-3">
                                                    <img src={santri.foto_url || `https://ui-avatars.com/api/?name=${santri.nama_santri}&background=teal&color=fff`} alt={santri.nama_santri} className="w-8 h-8 rounded-full object-cover" />
                                                    {santri.nama_santri}
                                                </th>
                                                <td className="px-6 py-4 text-center">{jumlah_kitab}</td>
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
