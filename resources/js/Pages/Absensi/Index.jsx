import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Pagination from "@/Components/Pagination"; // Import the Pagination component

export default function AttendanceIndex({ auth }) {
    const { attendances, todayAttendances, statusData } = usePage().props;

    const getStatusBadge = (status) => {
        switch (status) {
            case "attend":
                return (
                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                        Hadir
                    </span>
                );
            case "leave":
                return (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded">
                        Cuti
                    </span>
                );
            case "sick":
            case "permit":
            case "business_trip":
            case "remote":
                return (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                        {status}
                    </span>
                );
            default:
                return (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">
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
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Change legend text color
                }
            },
            title: {
                display: true,
                text: 'Jumlah Absensi per Status',
                color: 'white', // Change title text color
                font: {
                    size: 18
                }
            },
            tooltip: {
                titleColor: 'white', // Change tooltip title color
                bodyColor: 'white', // Change tooltip body color
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Change tooltip background color
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white' // Change x-axis text color
                }
            },
            y: {
                ticks: {
                    color: 'white' // Change y-axis text color
                }
            }
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard Absensi" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 p-4">
                    {/* Today's Attendance */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:text-gray-800 dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h2 className="text-xl mb-5">
                                Data Absensi Hari Ini
                            </h2>
                            <div className="flex">
                                <div className="w-1/2 max-h-96 overflow-auto pr-4">
                                    <table className="border-b-2 border-gray-200 min-w-full">
                                        <thead>
                                            <tr className="bg-gray-700 dark:text-gray-200 dark:bg-gray-200">
                                                <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                                    Deskripsi
                                                </th>
                                                <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                                    Waktu
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todayAttendances?.length > 0 ? (
                                                todayAttendances.map(
                                                    ({
                                                        id,
                                                        user,
                                                        status,
                                                        description,
                                                        created_at,
                                                    }) => (
                                                        <tr
                                                            key={id}
                                                            className="border-b-2"
                                                        >
                                                            <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                                {user?.name ||
                                                                    "Unknown"}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                                {getStatusBadge(
                                                                    status
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                                {description ||
                                                                    "Hadir"}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                                {created_at
                                                                    ? new Date(
                                                                          created_at
                                                                      ).toLocaleString()
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-4"
                                                    >
                                                        Belum ada data masuk.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-1/2">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Attendance Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-xl mb-5">
                                Data Kehadiran Keluarga Salman Al-Farisi
                            </h1>
                            <table className="border-b-2 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="bg-gray-700 dark:bg-gray-200">
                                        <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium dark:text-gray-800 text-gray-200">
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances?.data.length > 0 ? (
                                        attendances.data.map(
                                            ({
                                                id,
                                                user,
                                                status,
                                                description,
                                                created_at,
                                            }) => (
                                                <tr
                                                    key={id}
                                                    className="border-b-2"
                                                >
                                                    <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                        {user?.name ||
                                                            "Unknown"}
                                                    </td>
                                                    <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                        {getStatusBadge(status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                        {description || "Hadir"}
                                                    </td>
                                                    <td className="px-6 py-4 text-lg text-gray-700 dark:text-gray-200">
                                                        {created_at
                                                            ? new Date(
                                                                  created_at
                                                              ).toLocaleString()
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-4"
                                            >
                                                Tidak ada data absensi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={attendances.links} />{" "}
                            {/* Add Pagination component here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}