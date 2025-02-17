import Pagination from "@/Components/Pagination";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function UserIndex({ auth, users }) {
    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Daftar User" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Daftar User" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />
                        <div className="p-7 flex justify-between items-center">
                            <Link
                                href={route("users.create")}
                                className="dark:hover:bg-teal-900 hover:bg-teal-100 border rounded-md border-teal-500 text-teal-700 hover:text-teal-900 dark:text-white font-bold py-2 px-4"
                            >
                                Create User
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <label className="font-light text-gray-700 dark:text-gray-200">
                                Total User:
                                <span className="px-2 py-1 ml-3 bg-gray-200 rounded dark:bg-gray-700">
                                    {users.total}
                                </span>
                            </label>
                            <table className="border-b-1 border-gray-200 min-w-full overflow-auto shadow-xl mt-3">
                                <thead>
                                    <tr className="border-b-2 border-teal-200 dark:border-gray-900">
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tl-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Id
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Name
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Email
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Role
                                        </th>
                                        <th className="px-3 py-3 text-left text-xl font-bold rounded-tr-xl bg-teal-600 dark:bg-gray-900 text-white dark:text-gray-100">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-teal-500 dark:bg-gray-600 dark:divide-gray-900">
                                    {users.data.map(
                                        ({ id, name, email, role }) => (
                                            <tr key={id}>
                                                <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    {id}
                                                </td>
                                                <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    {name}
                                                </td>
                                                <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    {email}
                                                </td>
                                                <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    {role}
                                                </td>
                                                <td className="px-3 py-3 text-left text-lg text-gray-700 dark:text-gray-100">
                                                    <Link
                                                        className="inline-flex items-center rounded-md border border-transparent bg-teal-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-white hover:border-teal-700 hover:text-teal-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:active:bg-gray-300"
                                                        href={route(
                                                            "users.edit",
                                                            id
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={users.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
