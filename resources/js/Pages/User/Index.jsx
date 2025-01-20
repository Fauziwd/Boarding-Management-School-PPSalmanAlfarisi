import Pagination from "@/Components/Pagination";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function UserIndex({ auth, users }) {

    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Daftar User" }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user} >
            <Head title="Daftar User" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                 <Breadcrumbs items={breadcrumbs} />
                    <div className="p-7 flex justify-between items-center">
                       

                        <Link
                            href={route("users.create")}
                            className="hover:bg-indigo-600 border rounded-md border-indigo-500 text-white font-bold py-2 px-4"
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
                            <table className="border-b-2 mt-3 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Id
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map(
                                        ({ id, name, email, role }) => (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {id}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {name}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {email}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {role}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    <Link
                                                    className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300"
                                                        href={route(
                                                            "users.edit",
                                                            id
                                                        )}
                                                    >Edit</Link>
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
