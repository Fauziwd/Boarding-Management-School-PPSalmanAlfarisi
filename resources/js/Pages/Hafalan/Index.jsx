import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import Chart from "react-apexcharts";

export default function Index({ auth, hafalans, juzCount, topJuz, topSantri }) {
    const { delete: destroy } = useForm();
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [detailSantri, setDetailSantri] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().substring(0, 7)
    ); // Default to current month

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan" },
    ];

    const handleDelete = (id) => {
        destroy(route("hafalan.destroy", id), {
            preserveScroll: true,
            onSuccess: () => alert(`Hafalan berhasil dihapus!`),
        });
    };

    const fetchMonthlySummary = async (month) => {
        const response = await axios.get(
            route("hafalan.monthlySummary", { month })
        );
        setMonthlySummary(response.data);
    };

    useEffect(() => {
        fetchMonthlySummary(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const currentMonth = new Date(selectedMonth).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });

    const chartOptions = {
        chart: {
            type: "donut",
            events: {
                mounted: function (chartContext, config) {
                    const topJuzName = topJuz ? `Juz ${topJuz.juz}` : "N/A";
                    const textColor =
                        document.documentElement.classList.contains("dark")
                            ? "#ffffff"
                            : "#000000";
                  
                    chartContext.el.insertAdjacentHTML("beforeend", innerText);
                },
            },
        },
        labels: juzCount.map((item) => `Juz ${item.juz}`),
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        theme: {
            mode: document.documentElement.classList.contains("dark")
                ? "#1f2937"
                : "#ffffff", 
        },
    };

    const chartSeries = juzCount.map((item) => item.total);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Hafalan" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />
                        <Link
                            href={route("hafalan.create")}
                            className="dark:hover:bg-teal-900 hover:bg-teal-100 border rounded-md border-teal-500 text-teal-700 hover:text-teal-900 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Hafalan
                        </Link>
                    </div>
                    <div className="flex">
                        <div className="w-1/4 overflow-hidden bg-white shadow-lg rounded-lg dark:bg-gray-800">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <h2 className="text-xl font-bold mb-4 bg-teal-600 dark:bg-gray-900 text-white px-4 py-2 shadow-lg rounded-lg">
                                    Rekap Hafalan Bulan {currentMonth}
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="month"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Pilih Bulan:
                                    </label>
                                    <input
                                        type="month"
                                        id="month"
                                        name="month"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                {Object.keys(monthlySummary).length > 0 ? (
                                    Object.keys(monthlySummary).map((juz) => (
                                        <div
                                            key={juz}
                                            className="mb-4 hover:shadow-md bg-gray-50 dark:bg-gray-700 p-4 rounded-lg dark:hover:bg-gray-900 hover:bg-gray-100 transition-colors"
                                        >
                                            <button
                                                onClick={() =>
                                                    setDetailSantri(juz)
                                                }
                                                className="w-full text-left flex justify-between items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                            >
                                                <span className="font-semibold dark:hover:text-gray-900">
                                                    Juz {juz}
                                                </span>
                                                <span className="bg-teal-600 text-white dark:hover:text-yellow-400 dark:hover:bg-gray-800 rounded-full px-3 py-1">
                                                    {monthlySummary[juz].length}
                                                </span>
                                            </button>
                                            {detailSantri === juz && (
                                                <ul className="mt-2 pl-4 text-gray-700 dark:text-gray-300">
                                                    {monthlySummary[juz].map(
                                                        (
                                                            {
                                                                nama,
                                                                created_at,
                                                            },
                                                            index
                                                        ) => (
                                                            <ul
                                                                className="overflow-x-auto whitespace-nowrap p-2 space-y-2 mr-0 -pr-2"
                                                                style={{
                                                                    scrollbarWidth:
                                                                        "none", // Untuk Firefox
                                                                    msOverflowStyle:
                                                                        "none", // Untuk IE dan Edge
                                                                }}
                                                            >
                                                                <li
                                                                    key={index}
                                                                    className="flex justify-between items-center gap-x-6 min-w-max p-0 border-b border-gray-200 dark:border-gray-700"
                                                                >
                                                                    <span className="text-lg font-bold">
                                                                        {nama}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {
                                                                            created_at
                                                                        }
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Tidak ada hafalan bulan ini.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="w-3/4 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 ml-4">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl mt-3">
                                    <thead>
                                        <tr className="border-b-2 border-teal-200 dark:border-gray-900">
                                            <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                                No
                                            </th>
                                            <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                                Nama Santri
                                            </th>
                                            <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                                Juz
                                            </th>
                                            <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                                Bulan
                                            </th>
                                            <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hafalans.data.length > 0 ? (
                                            hafalans.data.map(
                                                (
                                                    { id, santri, juz, month },
                                                    index
                                                ) => (
                                                    <tr
                                                        key={id}
                                                        className="border-b-2"
                                                    >
                                                        <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                            {santri.nama}
                                                        </td>
                                                        <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                            {juz}
                                                        </td>
                                                        <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                            {month}
                                                        </td>
                                                        <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                            <Link
                                                                href={route(
                                                                    "hafalan.edit",
                                                                    id
                                                                )}
                                                                className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        id
                                                                    )
                                                                }
                                                                className="ml-2 inline-block px-4 py-2 bg-red-600 text-white rounded-md"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center py-4"
                                                >
                                                    Tidak ada data hafalan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <Pagination links={hafalans.links} />
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="donut"
                                    width="380"
                                    className="mt-4"
                                />
                                <div className="mt-2 mb-4 text-left">
                                    <h3 className="text-xl font-light dark:text-gray-100">
                                        Setoran Terbanyak:
                                        <span className="font-bold">
                                            {" "}
                                            {topSantri ? topSantri : "N/A"}
                                        </span>
                                    </h3>
                                    <div className="text-left">
                                        <h3 className="text-xl font-light dark:text-gray-100">
                                            Juz Terbanyak:
                                            <span className="font-bold">
                                                {" "}
                                                {topJuz
                                                    ? `Juz ${topJuz.juz}`
                                                    : "Ada Kesalahan"}
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
