import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { FiPlus, FiSearch, FiUser, FiEdit2, FiEye } from "react-icons/fi";

export default function SantriIndex({ auth, santris, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        page: filters.page || 1,
        perPage: filters.perPage || 10,
    });

    const [searchTerm, setSearchTerm] = useState(data.search);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            get(route("santris.index"), {
                preserveState: true,
                replace: true,
                data: {
                    search: searchTerm,
                    page: data.page,
                    perPage: data.perPage,
                },
            });
        }, 300);

        debouncedSearch();

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, data.page, data.perPage]);

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        setData("search", searchValue);
        setData("page", 1);
        get(route("santris.index"), {
            preserveState: true,
            replace: true,
            data: {
                search: searchValue,
                page: 1,
                perPage: data.perPage,
            },
        });
    };

    const handlePageChange = (page) => {
        setData("page", page);
        get(route("santris.index"), {
            preserveState: true,
            replace: true,
            data: {
                search: searchTerm,
                page: page,
                perPage: data.perPage,
            },
        });
    };

    const handlePerPageChange = (e) => {
        setData("perPage", e.target.value);
        setData("page", 1);
        get(route("santris.index"), {
            preserveState: true,
            replace: true,
            data: {
                search: searchTerm,
                page: 1,
                perPage: e.target.value,
            },
        });
    };

    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Data Santri" },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Data Santri" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 ml-3">
                                <FiUser className="text-teal-500" />
                                Data Murid
                            </h1>
                            <Breadcrumbs items={breadcrumbs} className="mt-2" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white transition-all duration-200"
                                    placeholder="Search for..."
                                />
                            </div>
                            <Link
                                href={route("santris.create")}
                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FiPlus size={18} />
                                Add Student
                            </Link>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="px-6 mb-6">
                        <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-teal-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
                                        Total Murid Terdaftar
                                    </p>
                                    <p className="text-3xl font-bold text-teal-900 dark:text-white mt-1">
                                        {santris.total}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-gray-900">
                                    <FiUser className="text-teal-600 dark:text-teal-400" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-hidden bg-white shadow-xl sm:rounded-xl dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-gray-900 dark:to-gray-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tl-xl">
                                                No
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                NIS
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Nama Santri
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Tempat Lahir
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Tanggal Lahir
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Tahun Lulus
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tr-xl">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {santris.data.length > 0 ? (
                                            santris.data.map(({ id, nis, nama_santri, tempat_lahir, tanggal_lahir, tahun_lulus }, index) => (
                                                <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {(data.page - 1) * data.perPage + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                        {nis}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                           
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{nama_santri}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {tempat_lahir}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {tanggal_lahir}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                            tahun_lulus ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}>
                                                            {tahun_lulus || 'Aktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route("santris.show", id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                                        >
                                                            <FiEye size={14} />
                                                            Detail
                                                        </Link>
                                                        <Link
                                                            href={route("santris.edit", id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-teal-700 bg-teal-100 hover:bg-teal-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                                        >
                                                            <FiEdit2 size={14} />
                                                            Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Tidak ada data santri yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination and Per Page Selector */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Baris per halaman:</span>
                                    <select
                                        value={data.perPage}
                                        onChange={handlePerPageChange}
                                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <Pagination 
                                    links={santris.links} 
                                    onPageChange={handlePageChange}
                                    className="flex-1 sm:flex-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}