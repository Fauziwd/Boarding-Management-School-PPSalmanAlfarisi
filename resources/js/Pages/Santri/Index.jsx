import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Import the icon

export default function SantriIndex({ auth, santris, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        page: filters.page || 1,
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
                },
            });
        }, 300);

        debouncedSearch();

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, data.page]);

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        setData("search", searchValue);
        setData("page", 1); // Reset halaman ke halaman pertama saat melakukan pencarian
        get(route("santris.index"), {
            preserveState: true,
            replace: true,
            data: {
                search: searchValue,
                page: 1,
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
            },
        });
    };

    // Data untuk breadcrumbs
    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Santri" },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Santri" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />

                        <div className="flex items-center space-x-4">
                            <Link
                                href={route("santris.create")}
                                className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-all duration-200"
                            >
                                Tambah Santri
                            </Link>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Cari santri..."
                                />
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 dark:text-gray-100">
                            <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl">
                                <thead>
                                    <tr className="border-b-2 border-teal-200 dark:border-gray-900">
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            ID
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            NIS
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Nama
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tempat Lahir
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tanggal Lahir
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tahun Lulus
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-teal-500 dark:bg-gray-600 dark:divide-gray-900">
                                    {santris.data.length > 0 ? (
                                        santris.data.map(
                                            ({
                                                id,
                                                nis,
                                                nama,
                                                tempat_lahir,
                                                tanggal_lahir,
                                                tahun_lulus,
                                            }) => (
                                                <tr key={id} className="">
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {id}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {nis}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {nama}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {tempat_lahir}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {tanggal_lahir}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        {tahun_lulus}
                                                    </td>
                                                    <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                        <Link
                                                            href={route(
                                                                "santris.show",
                                                                id
                                                            )}
                                                            className="text-teal-400 dark:text-gray-900 hover:text-teal-200"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4"
                                            >
                                                Tidak ada data santri.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination
                                links={santris.links}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}