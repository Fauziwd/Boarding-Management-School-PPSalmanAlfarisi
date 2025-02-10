import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
export default function SantriIndex({ auth, santris }) {
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

                        <Link
                            href={route("santris.create")}
                            className="hover:bg-indigo-600 hover:text-white border rounded-md border-indigo-500 text-indigo-600 dark:text-white font-bold py-2 px-4"
                        >
                            Tambah Santri
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 dark:text-gray-100">
                            <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl">
                                <thead>
                                    <tr className="border-b-2 border-indigo-200 dark:border-gray-900">
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            No
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            NIS
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Nama
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tempat Lahir
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tanggal Lahir
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Tahun Lulus
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-indigo-500 dark:bg-gray-600 dark:divide-gray-900">
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
                                                <tr
                                                    key={id}
                                                    className=""
                                                >
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
                                                            className="text-indigo-400 dark:text-gray-900 hover:text-indigo-200"
                                                        >
                                                            Detail
                                                        </Link>

                                                        {/* <Link
                                                            href={route(
                                                                "santris.edit",
                                                                id
                                                            )}
                                                            className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                                                        >
                                                            Edit
                                                        </Link> */}
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
                            <Pagination links={santris.links} />{" "}
                            {/* Add Pagination component here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
