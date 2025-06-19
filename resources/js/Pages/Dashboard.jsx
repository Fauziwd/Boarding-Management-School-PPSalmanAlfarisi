import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MenuDashboard from "./MenuDashboard";

export default function Dashboard() {
    const { auth, santris, filters } = usePage().props;
    const userName = auth.user?.name || "Pengguna";
    const userRole = auth.user?.role || "Tidak Diketahui";

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        page: filters.page || 1,
        perPage: filters.perPage || 10,
    });

    const [searchTerm, setSearchTerm] = useState(data.search);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            get(route("dashboard"), {
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
    };

    const handlePageChange = (page) => {
        setData("page", page);
    };

    const handlePerPageChange = (e) => {
        setData("perPage", e.target.value);
        setData("page", 1);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-teal-700 dark:text-gray-100">
                            Hi,{" "}
                            <span className="text-teal-600 dark:text-teal-400">
                                {userName}
                            </span>
                        </h2>
                        <p className="mt-2 text-sm font-medium text-teal-800/80 dark:text-gray-300">
                            As an{" "}
                            <span className="inline-block mr-1 px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-800 dark:bg-gray-700 dark:text-teal-300">
                                {userRole}
                            </span>
                            Feel free to check out all the menus on this page!
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Menu Dashboard */}
                    <MenuDashboard LinkComponent={Link} />

                    {/* Main Content Card */}
                    <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-100 dark:ring-gray-700">
                        <div className="p-6">
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Search for..."
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route("santris.create")}
                                        className="group relative inline-flex items-center overflow-hidden rounded-xl px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 dark:from-gray-800 dark:to-gray-700 text-white dark:text-gray-100 font-medium shadow-lg hover:shadow-teal-500/30 dark:hover:shadow-black/40 transition-all duration-500 hover:-translate-y-1"
                                    >
                                        {/* Main text */}
                                        <span className="relative z-10 transition-all duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                                            Add Data
                                        </span>

                                        {/* Hover text */}
                                        <span className="absolute left-6 top-1/2 -translate-y-full opacity-0 font-kufi text-xl font-bold transition-all duration-500 group-hover:-translate-y-1/2 group-hover:opacity-100">
                                            Now!
                                        </span>

                                        {/* Light mode decoration */}
                                        <div className="absolute bottom-4 -right-6 h-40 w-16 rounded-full bg-teal-500/30 transition-transform duration-700 group-hover:scale-150 dark:hidden" />

                                        {/* Dark mode decoration */}
                                        <div className="absolute bottom-4 -right-6 h-40 w-16 rounded-full bg-white/10 hidden dark:block transition-transform duration-700 group-hover:scale-150 group-hover:shadow-[inset_0_0_10px_0_rgba(0,0,0,0.5)]" />

                                        {/* Animated icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="ml-2 h-5 w-5 text-white opacity-0 -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gradient-to-r from-teal-600 to-teal-500 dark:from-gray-700 dark:to-gray-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider rounded-tl-xl"
                                            >
                                                No
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider"
                                            >
                                                NIS
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider"
                                            >
                                                Tempat Lahir
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider"
                                            >
                                                Tanggal Lahir
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider"
                                            >
                                                Tahun Lulus
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider rounded-tr-xl"
                                            >
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {santris.data.length > 0 ? (
                                            santris.data.map(
                                                (santri, index) => (
                                                    <tr
                                                        key={santri.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {(data.page - 1) *
                                                                data.perPage +
                                                                index +
                                                                1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {santri.nis}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {santri.nama}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {
                                                                santri.tempat_lahir
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {
                                                                santri.tanggal_lahir
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {santri.tahun_lulus}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route(
                                                                        "santris.show",
                                                                        santri.id
                                                                    )}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                                                >
                                                                    Detail
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "santris.edit",
                                                                        santri.id
                                                                    )}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-teal-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-teal-400 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    Tidak ada data santri.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Menampilkan{" "}
                                        <span className="font-medium">
                                            {(data.page - 1) * data.perPage + 1}
                                        </span>{" "}
                                        sampai{" "}
                                        <span className="font-medium">
                                            {Math.min(
                                                data.page * data.perPage,
                                                santris.total
                                            )}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-extrabold bg-teal-200/20 dark:bg-teal-600/20 px-2 py-1 rounded-md text-teal-800 dark:text-white">
                                            {santris.total}
                                        </span>{" "}
                                        santri
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={data.perPage}
                                        onChange={handlePerPageChange}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="5">5 per halaman</option>
                                        <option value="10">
                                            10 per halaman
                                        </option>
                                        <option value="25">
                                            25 per halaman
                                        </option>
                                        <option value="50">
                                            50 per halaman
                                        </option>
                                    </select>
                                    <nav className="flex space-x-1">
                                        {santris.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                onClick={(e) => {
                                                    if (!link.url)
                                                        e.preventDefault();
                                                    else
                                                        handlePageChange(
                                                            link.url.split(
                                                                "page="
                                                            )[1]
                                                        );
                                                }}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? "bg-teal-600 text-white"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                } ${
                                                    !link.url
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
