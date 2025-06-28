import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { MagnifyingGlassIcon, ChartBarIcon, CalendarIcon, AcademicCapIcon, UserGroupIcon, CogIcon } from "@heroicons/react/24/outline";
import MenuDashboard from "./MenuDashboard";
import Pagination from "@/Components/Pagination";

export default function Dashboard() {
    const { auth, santris, filters } = usePage().props;
    const userName = auth.user?.name || "Pengguna";
    const userRole = auth.user?.role || "Tidak Diketahui";

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "Aktif");
    const [page, setPage] = useState(filters.page || 1);
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    const reload = useCallback(
        debounce((newFilters) => {
            router.get(route("dashboard"), newFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        const newFilters = { search: searchTerm, status: statusFilter, page, perPage };
        reload(newFilters);
    }, [searchTerm, statusFilter, page, perPage, reload]);

    const getStatusColor = (status) => {
        const colors = {
            'Aktif': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
            'Lulus': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            'Pindah': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
            'Berhenti': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    // Stats data - you can replace with real data
    const stats = [
        { name: 'Total Santri', value: santris.total, icon: UserGroupIcon, change: '+12%', changeType: 'increase' },
        { name: 'Santri Aktif', value: santris.data.filter(s => s.status_santri === 'Aktif').length, icon: AcademicCapIcon, change: '+5%', changeType: 'increase' },
        { name: 'Kelas Aktif', value: 8, icon: CalendarIcon, change: '-2%', changeType: 'decrease' },
        { name: 'Kehadiran Hari Ini', value: '92%', icon: ChartBarIcon, change: '+3%', changeType: 'increase' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Selamat datang kembali, <span className="font-medium text-emerald-600 dark:text-emerald-400">{userName}</span>
                        </span>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Role: <span className="font-medium">{userRole}</span>
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, statIdx) => (
                            <div key={statIdx} className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 rounded-lg p-3 bg-emerald-50 dark:bg-emerald-900/20">
                                            <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</dt>
                                            <dd className="flex items-baseline">
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                                <p className={`ml-2 flex items-baseline text-sm font-medium ${stat.changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {stat.change}
                                                </p>
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-6">
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setPage(1);
                                            }}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                            placeholder="Cari nama, NIS, kelas..."
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setPage(1);
                                            }}
                                            className="appearance-none w-full sm:w-48 block pl-3 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                        >
                                            <option value="Semua">Semua Status</option>
                                            <option value="Aktif">Aktif</option>
                                            <option value="Lulus">Lulus</option>
                                            <option value="Pindah">Pindah</option>
                                            <option value="Berhenti">Berhenti</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={route("santris.create")}
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    Tambah Santri
                                </Link>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIS</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Santri</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {santris.data.length > 0 ? (
                                            santris.data.map((santri) => (
                                                <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{santri.nis}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{santri.nama_santri}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{santri.kelas?.nama_kelas || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(santri.status_santri)}`}>
                                                            {santri.status_santri}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-3">
                                                            <Link 
                                                                href={route("santris.show", santri.id)} 
                                                                className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200"
                                                            >
                                                                Detail
                                                            </Link>
                                                            <Link 
                                                                href={route("santris.edit", santri.id)} 
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Data tidak ditemukan</h3>
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tidak ada santri yang cocok dengan pencarian atau filter Anda.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination & Per Page Selector */}
                            {santris.data.length > 0 && (
                                <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Menampilkan <span className="font-medium text-gray-700 dark:text-gray-200">{santris.from}</span> - <span className="font-medium text-gray-700 dark:text-gray-200">{santris.to}</span> dari <span className="font-medium text-gray-700 dark:text-gray-200">{santris.total}</span> santri
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Per halaman:</span>
                                            <select
                                                value={perPage}
                                                onChange={(e) => {
                                                    setPerPage(e.target.value);
                                                    setPage(1);
                                                }}
                                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                            </select>
                                        </div>
                                        <Pagination links={santris.links} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu Dashboard */}
                    <MenuDashboard LinkComponent={Link} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}