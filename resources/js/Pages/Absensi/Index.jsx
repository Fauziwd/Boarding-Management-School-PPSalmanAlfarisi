import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Pagination from "@/Components/Pagination";

export default function AttendanceIndex({ auth }) {
    const { attendances, todayAttendances, statusData } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleDarkModeChange = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };

        handleDarkModeChange(); // Initial check
        window.addEventListener("DOMContentLoaded", handleDarkModeChange);
        window.addEventListener("change", handleDarkModeChange);

        return () => {
            window.removeEventListener(
                "DOMContentLoaded",
                handleDarkModeChange
            );
            window.removeEventListener("change", handleDarkModeChange);
        };
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case "attend":
                return (
                    <span className="border border-emerald-900 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-100 px-2 py-1 rounded-full">
                        Hadir
                    </span>
                );
            case "leave":
                return (
                    <span className="border border-gray-900 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-100 px-2 py-1 rounded-full">
                        Cuti
                    </span>
                );
            case "sick":
            case "permit":
            case "business_trip":
            case "remote":
                return (
                    <span className="border border-yellow-900 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-100 px-2 py-1 rounded-full">
                        {status}
                    </span>
                );
            default:
                return (
                    <span className="border border-yellow-900 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-100 px-2 py-1 rounded-full">
                        {status}
                    </span>
                );
        }
    };

    const chartData = {
        labels: statusData.map((data) => data.status),
        datasets: [
            {
                label: "Data Absensi Hari Ini",
                data: statusData.map((data) => data.count),
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
                borderRadius: 15,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: { labels: { color: isDarkMode ? "white" : "black" } },
            title: {
                display: false,
                text: "Jumlah Absensi per Status",
                color: isDarkMode ? "white" : "black",
                font: { size: 18 },
            },
            tooltip: {
                titleColor: isDarkMode ? "white" : "black",
                bodyColor: isDarkMode ? "white" : "black",
                backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.7)"
                    : "rgba(255, 255, 255, 0.7)",
            },
        },
        scales: {
            x: { ticks: { color: isDarkMode ? "white" : "black" } },
            y: { ticks: { color: isDarkMode ? "white" : "black" } },
        },
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard Absensi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 p-4 space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 text-gray-800 dark:text-white p-6 rounded-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            Data Absensi Hari Ini
                        </h2>
                        {todayAttendances?.length === 0 ? (
                            <div className="text-center">
                                <img
                                    src="/img/empty.png"
                                    alt="No Data"
                                    className="w-70 h-64 mx-auto mt-4"
                                    draggable="false"
                                />
                                <p className="text-gray-500 dark:text-white">
                                    Belum ada data masuk.
                                </p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-md overflow-hidden">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                            Nama
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                            Role
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                            Deskripsi
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                            Waktu
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-600 dark:divide-gray-700">
                                    {todayAttendances.map(
                                        ({
                                            id,
                                            user,
                                            role,
                                            status,
                                            description,
                                            created_at,
                                        }) => (
                                            <tr key={id}>
                                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {user?.name || "Unknown"}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {user.role}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {getStatusBadge(status)}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {description || "Hadir"}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {created_at
                                                        ? new Date(
                                                              created_at
                                                          ).toLocaleString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 text-gray-800 dark:text-white p-6 rounded-md shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h1 className="text-xl font-bold">
                                Data Kehadiran Keluarga Salman Al-Farisi
                            </h1>
                            <h2 className="text-xl font-bold">
                                Data Absensi per Status Hari Ini
                            </h2>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 mb-4 md:mb-0 pr-7">
                                {attendances?.data.length === 0 ? (
                                    <div className="text-center">
                                        <img
                                            src="/img/empty.png"
                                            alt="No Data"
                                            className="w-70 h-64 mx-auto mt-4"
                                            draggable="false"
                                        />
                                        <p className="text-gray-500 dark:text-white">
                                            Tidak ada data absensi.
                                        </p>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-md overflow-hidden">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                                    Nama
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                                    Status
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                                    Deskripsi
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-medium bg-teal-600 dark:bg-gray-800 text-white dark:text-gray-100">
                                                    Tanggal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-600 dark:divide-gray-700">
                                            {attendances.data.map(
                                                ({
                                                    id,
                                                    user,
                                                    role,
                                                    status,
                                                    description,
                                                    created_at,
                                                }) => (
                                                    <tr key={id}>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {user?.name ||
                                                                "Unknown"}
                                                        </td>

                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {getStatusBadge(
                                                                status
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {description ||
                                                                "Hadir"}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {created_at
                                                                ? new Date(
                                                                      created_at
                                                                  ).toLocaleString()
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                )}
                                <Pagination links={attendances.links} />
                            </div>
                            <div className="w-auto md:w-1/2 p-4 shadow-xl rounded-md dark:bg-gray-800">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
