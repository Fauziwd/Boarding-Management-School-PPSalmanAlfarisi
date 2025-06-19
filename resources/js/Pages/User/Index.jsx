import Pagination from "@/Components/Pagination";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { FiEdit2, FiPlus, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

export default function UserIndex({ auth, users }) {
    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "User Management" },
    ];

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-4"
                    >
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 ml-3 mb-3">
                                <FiUsers className="text-teal-500" />
                                User Management
                            </h1>
                            <Breadcrumbs items={breadcrumbs} className="mt-2" />
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={route("users.create")}
                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FiPlus size={18} />
                                Create New User
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="px-6 mb-6"
                    >
                        <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-teal-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
                                        Total Registered Users
                                    </p>
                                    <p className="text-3xl font-bold text-teal-900 dark:text-white mt-1">
                                        {users.total}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-gray-900">
                                    <FiUsers className="text-teal-600 dark:text-teal-400" size={24} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Table Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="overflow-hidden bg-white shadow-xl sm:rounded-xl dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl"
                    >
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-gray-900 dark:to-gray-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tl-xl">
                                                ID
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                User
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tr-xl">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <motion.tbody 
                                        className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {users.data.map(({ id, name, email, role }) => (
                                            <motion.tr 
                                                key={id} 
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                                variants={item}
                                                whileHover={{ scale: 1.005 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    #{id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <motion.div 
                                                            className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-gray-700 flex items-center justify-center"
                                                            whileHover={{ rotate: 360 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <span className="text-teal-800 dark:text-teal-300 font-medium">
                                                                {name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </motion.div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.span 
                                                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                            role === 'admin' 
                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        }`}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {role}
                                                    </motion.span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Link
                                                            href={route("users.edit", id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                                        >
                                                            <FiEdit2 size={14} />
                                                            Edit
                                                        </Link>
                                                    </motion.div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl"
                            >
                                <Pagination links={users.links} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}