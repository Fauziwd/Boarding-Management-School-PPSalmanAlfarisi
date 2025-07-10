import React, { useEffect } from 'react'; // Import useEffect
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

// Komponen untuk Ikon pada Widget
const WidgetIcon = ({ icon, color }) => {
    const iconColor = `text-${color}-500 dark:text-${color}-400`;
    const bgColor = `bg-${color}-100 dark:bg-${color}-900/50`;
    return (
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${bgColor} ${iconColor}`}>
            {icon}
        </div>
    );
};

export default function AttendanceIndex({ auth, attendanceData, filterDate, stats }) {
    
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        router.get(route('absensi.index'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const handleStatusChangeByAdmin = (santri_id, type, status) => {
        if (!confirm('Anda yakin ingin mengubah status absensi santri ini?')) {
            return;
        }
        router.patch(route('absensi.updateByAdmin'), {
            santri_id,
            date: filterDate,
            type,
            status,
        }, {
            preserveScroll: true,
        });
    };

    // --- LOGIKA BARU UNTUK REFRESH OTOMATIS YANG LEBIH CERDAS ---
    useEffect(() => {
        const getFormattedDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const interval = setInterval(() => {
            const today = new Date();
            const todayString = getFormattedDate(today);
            
            // Cek jika tanggal yang ditampilkan BUKAN hari ini
            if (filterDate !== todayString) {
                // Buat tanggal kemarin berdasarkan tanggal hari ini
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const yesterdayString = getFormattedDate(yesterday);

                // HANYA refresh jika tanggal yang ditampilkan adalah tanggal kemarin
                if (filterDate === yesterdayString) {
                    console.log('Hari telah berganti. Memuat ulang data absensi untuk hari ini...');
                    router.get(route('absensi.index'), {}, {
                        preserveState: false, 
                        onSuccess: () => {
                            console.log('Data absensi berhasil diperbarui untuk hari ini.');
                        }
                    });
                }
            }
        }, 60000); // Cek setiap 1 menit

        return () => clearInterval(interval);
    }, [filterDate]);


    const statusOptions = ['Hadir', 'Sakit', 'Izin', 'Alpa', 'Belum Absen'];

    const widgetData = [
        { label: 'Hadir', value: stats.Hadir, color: 'emerald', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Sakit', value: stats.Sakit, color: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Izin', value: stats.Izin, color: 'sky', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
        { label: 'Alpa', value: stats.Alpa, color: 'rose', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
        { label: 'Belum Absen', value: stats['Belum Absen'], color: 'gray', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Tanpa Kelompok', value: stats['Tanpa Kelompok'], color: 'violet', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring Absensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Monitoring Absensi Santri</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Menampilkan data untuk tanggal: {new Date(filterDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex-grow relative">
                                    <label htmlFor="date" className="absolute -top-2 left-2 px-1 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">Ganti Tanggal</label>
                                    <input type="date" id="date" defaultValue={filterDate} onChange={handleDateChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                                </div>
                                <Link href={route('absensi.create')} className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Input
                                </Link>
                            </div>
                        </div>

                        {/* Widget Statistik */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                            {widgetData.map(widget => (
                                <div key={widget.label} className="bg-white dark:bg-gray-700/50 p-4 rounded-xl shadow-md flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1">
                                    <WidgetIcon icon={widget.icon} color={widget.color} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{widget.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{widget.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabel Absensi */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">Nama Santri</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">Absensi Halaqoh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">Absensi Kelas</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {attendanceData.length > 0 ? attendanceData.map((santri) => (
                                        <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">{santri.name.charAt(0)}</div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{santri.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {santri.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {auth.user.role === 'admin' ? (
                                                    <select value={santri.halaqoh_attendance} onChange={(e) => handleStatusChangeByAdmin(santri.id, 'halaqoh', e.target.value)} disabled={!santri.has_halaqoh} className={`text-sm rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 w-full max-w-xs p-2 ${!santri.has_halaqoh ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}>
                                                        {santri.has_halaqoh ? ( statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>) ) : ( <option>Tidak Ada Halaqoh</option> )}
                                                    </select>
                                                ) : (
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>{santri.halaqoh_attendance}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {auth.user.role === 'admin' ? (
                                                    <select value={santri.study_class_attendance} onChange={(e) => handleStatusChangeByAdmin(santri.id, 'study_class', e.target.value)} disabled={!santri.has_study_class} className={`text-sm rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 w-full max-w-xs p-2 ${!santri.has_study_class ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}>
                                                        {santri.has_study_class ? ( statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>) ) : ( <option>Tidak Ada Kelas</option> )}
                                                    </select>
                                                ) : (
                                                     <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>{santri.study_class_attendance}</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="px-6 py-12 text-center"><h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tidak ada data santri</h3></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="mb-2 md:mb-0">
                                Total Santri Aktif: <span className="font-medium text-gray-700 dark:text-gray-300">{attendanceData.length}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
                                    <span>Hadir</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                                    <span>Sakit</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-sky-800 mr-1"></span>
                                    <span>Izin</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-rose-500 mr-1"></span>
                                    <span>Alpa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
