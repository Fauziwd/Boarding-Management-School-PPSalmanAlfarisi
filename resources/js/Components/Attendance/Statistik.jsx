import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Statistik() {
    const { attendanceStats, totalAttendances } = usePage().props;
    const [showDetails, setShowDetails] = useState(false);

    const statusLabels = {
        attend: "Hadir",
        leave: "Cuti",
        sick: "Sakit",
        permit: "Izin",
        business_trip: "Perjalanan Dinas",
        remote: "Hybrid/WFH"
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const attendanceCount = attendanceStats.find(stat => stat.status === 'attend')?.count || 0;
    const wfhCount = attendanceStats.find(stat => stat.status === 'remote')?.count || 0;
    const totalPresentDays = attendanceCount + wfhCount;
    const attendanceAccuracy = (totalPresentDays / daysInMonth) * 100;

    const totalAbsences = attendanceStats.reduce((total, stat) => {
        if (stat.status !== 'attend' && stat.status !== 'remote') {
            return total + stat.count;
        }
        return total;
    }, 0);

    const chartOptions = {
        series: [{
            name: 'Jumlah Kehadiran',
            data: attendanceStats.map(stat => stat.count)
        }],
        chart: {
            type: 'area',
            height: 350,
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0.4,
                opacityFrom: 0.4,
                opacityTo: 0.5,
                stops: [0, 90, 100]
              }
        },
        title: {
            text: 'Statistik Kehadiran',
            align: 'left'
        },
        xaxis: {
            categories: attendanceStats.map(stat => statusLabels[stat.status] || stat.status)
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " kali"
                }
            }
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistik Kehadiran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    className="p-4 bg-indigo-100 dark:bg-gray-700 rounded-lg shadow cursor-pointer"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <p className="text-sm text-indigo-600 dark:text-gray-300">Total Kehadiran</p>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-gray-100">{totalAttendances}</p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-gray-700 rounded-lg shadow">
                    <p className="text-sm text-green-600 dark:text-gray-300">Akurasi Kehadiran</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-gray-100">{attendanceAccuracy.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-red-100 dark:bg-gray-700 rounded-lg shadow">
                    <p className="text-sm text-red-600 dark:text-gray-300">Total Absensi</p>
                    <p className="text-3xl font-bold text-red-900 dark:text-gray-100">{totalAbsences} hari</p>
                </div>
            </div>
            {showDetails && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {attendanceStats.map(stat => (
                        <div key={stat.status} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{statusLabels[stat.status] || stat.status}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.count}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6">
                <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="area"
                    width="100%"
                    height="350"
                />
            </div>
        </div>
    );
}