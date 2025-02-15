import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Statistik() {
    const { attendanceStats, totalAttendances } = usePage().props;
    const [showDetails, setShowDetails] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    useEffect(() => {
        const updateDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        updateDarkMode();
        window.addEventListener('DOMContentLoaded', updateDarkMode);
        window.addEventListener('change', updateDarkMode);
        return () => {
            window.removeEventListener('DOMContentLoaded', updateDarkMode);
            window.removeEventListener('change', updateDarkMode);
        };
    }, []);

    const chartOptions = {
        series: [{
            name: 'Jumlah Kehadiran',
            data: attendanceStats.map(stat => stat.count)
        }],
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                }
            },
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
                shade: isDarkMode ? 'dark' : 'light',
                shadeIntensity: 0.4,
                opacityFrom: 0.4,
                opacityTo: 0.5,
                stops: [0, 90, 100]
            }
        },
        title: {
            text: 'Statistik Kehadiran',
            align: 'left',
            style: {
                color: isDarkMode ? '#ffffff' : '#000000'
            }
        },
        xaxis: {
            categories: attendanceStats.map(stat => statusLabels[stat.status] || stat.status),
            labels: {
                style: {
                    colors: isDarkMode ? '#ffffff' : '#000000'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: isDarkMode ? '#ffffff' : '#000000'
                }
            }
        },
        tooltip: {
            theme: isDarkMode ? 'dark' : 'light',
            y: {
                formatter: function (val) {
                    return val + " kali"
                }
            }
        },
        grid: {
            borderColor: isDarkMode ? '#444444' : '#e7e7e7'
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistik Kehadiran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    className="p-4 bg-indigo-100 dark:bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-indigo-200 dark:hover:bg-gray-600 transition duration-300"
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
            <div className={`mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                {showDetails && attendanceStats.map(stat => (
                    <div key={stat.status} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border-2 border-indigo-500">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{statusLabels[stat.status] || stat.status}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.count}</p>
                    </div>
                ))}
            </div>
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