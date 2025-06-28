import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Chart from 'react-apexcharts';
import { ChartBarIcon, PlusCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Komponen untuk kartu "Top 3"
const TopAbsenteesCard = ({ title, data, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className={`text-lg font-semibold flex items-center mb-4 ${color}`}>
            <Icon className="w-6 h-6 mr-2" /> Top 3 Santri Sering {title}
        </h3>
        <ul className="space-y-3">
            {data.length > 0 ? data.map(item => (
                <li key={item.santri.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={item.santri.foto_url || `https://ui-avatars.com/api/?name=${item.santri.nama_santri}&background=random`} alt={item.santri.nama_santri} className="w-8 h-8 rounded-full object-cover mr-3" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.santri.nama_santri}</span>
                    </div>
                    <span className={`font-bold text-lg ${color}`}>{item.total}x</span>
                </li>
            )) : <p className="text-sm text-gray-500 italic">Tidak ada data.</p>}
        </ul>
    </div>
);

export default function AttendanceIndex({ auth, stats }) {
    const chartOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: ['Hadir', 'Sakit', 'Izin', 'Alpa'] },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
        tooltip: { theme: 'dark' }
    };

    const chartSeries = [{ name: 'Jumlah', data: [stats.summary.hadir, stats.summary.sakit, stats.summary.izin, stats.summary.alpa] }];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                 <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        <ChartBarIcon className="w-6 h-6 inline-block mr-2" />
                        Statistik Absensi (30 Hari Terakhir)
                    </h2>
                    <Link href={route('absensi.create')} className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-500">
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Input Absensi
                    </Link>
                </div>
            }
        >
            <Head title="Statistik Absensi" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Total Kehadiran</h3>
                        <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TopAbsenteesCard title="Sakit" data={stats.topSakit} icon={ExclamationTriangleIcon} color="text-amber-500" />
                        <TopAbsenteesCard title="Izin" data={stats.topIzin} icon={InformationCircleIcon} color="text-blue-500" />
                        <TopAbsenteesCard title="Alpa" data={stats.topAlpa} icon={XCircleIcon} color="text-red-500" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}