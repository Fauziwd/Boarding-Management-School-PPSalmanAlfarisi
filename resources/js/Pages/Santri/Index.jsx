import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Pagination from "../../Components/Pagination";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { FiPlus, FiSearch, FiUser, FiEdit2, FiEye, FiTrash2, FiFilter, FiXCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Swal from 'sweetalert2';

// Komponen Badge Status untuk visualisasi yang lebih baik
const StatusBadge = ({ status }) => {
    const statusStyles = {
        Aktif: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        Lulus: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
        Keluar: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    };

    return (
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default function SantriIndex({ auth, santris, filters, success }) {
    // State untuk semua parameter filter, diinisialisasi dari props
    const [params, setParams] = useState({
        search: filters.search || "",
        status: filters.status || "Aktif",
        gender: filters.gender || "",
        sort_by: filters.sort_by || "nama_santri",
        sort_direction: filters.sort_direction || "asc",
    });

    const reload = useCallback(
        debounce((query) => {
            router.get(route("santris.index"), query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        const query = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== ""));
        reload(query);
    }, [params, reload]);

    useEffect(() => {
        if (success) {
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: success, showConfirmButton: false, timer: 3000
            });
        }
    }, [success]);

    const handleFilterChange = (key, value) => {
        setParams((prevParams) => ({ ...prevParams, [key]: value }));
    };

    const handleSort = (newSortBy) => {
        setParams(prevParams => ({
            ...prevParams,
            sort_by: newSortBy,
            sort_direction: prevParams.sort_by === newSortBy && prevParams.sort_direction === 'asc' ? 'desc' : 'asc',
        }));
    };
    
    const resetFilters = () => {
        setParams({
            search: "",
            status: "Aktif",
            gender: "",
            sort_by: "nama_santri",
            sort_direction: "asc",
        });
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: `Yakin ingin menghapus data ${name}?`,
            text: "Data yang sudah dihapus tidak dapat dikembalikan!",
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('santris.destroy', id), { preserveScroll: true });
            }
        });
    };

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Data Santri" },
    ];

    // Komponen untuk header tabel yang bisa di-sort
    const SortableHeader = ({ children, name }) => {
        const isSorted = params.sort_by === name;
        return (
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <button onClick={() => handleSort(name)} className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-100 transition-colors">
                    {children}
                    {isSorted && (params.sort_direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)}
                </button>
            </th>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Data Santri" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Halaman */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <FiUser className="text-teal-500" />
                                Manajemen Data Santri
                            </h1>
                            <Breadcrumbs items={breadcrumbs} />
                        </div>
                        <Link
                            href={route("santris.create")}
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <FiPlus size={18} />
                            Tambah Santri
                        </Link>
                    </div>

                    {/* Panel Filter */}
                    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            {/* Filter Pencarian */}
                            <div className="w-full">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cari Santri</label>
                                <div className="relative mt-1">
                                    <FiSearch className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                                    <input
                                        id="search" type="text" value={params.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                                        placeholder="NIS atau Nama..."
                                    />
                                </div>
                            </div>
                            {/* Filter Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    id="status" value={params.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Lulus">Lulus</option>
                                    <option value="Keluar">Keluar</option>
                                </select>
                            </div>
                            {/* Filter Jenis Kelamin */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                                <select
                                    id="gender" value={params.gender}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Semua</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            {/* Tombol Reset */}
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                            >
                                <FiXCircle size={16} />
                                Reset Filter
                            </button>
                        </div>
                    </div>

                    {/* Tabel Data */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <SortableHeader name="nama_santri">Santri</SortableHeader>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wali & Kontak</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tahun Ke</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {santris.data.length > 0 ? (
                                        santris.data.map((santri) => (
                                            <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-11 w-11">
                                                            <img className="h-11 w-11 rounded-full object-cover" src={santri.foto_url || `https://ui-avatars.com/api/?name=${santri.nama_santri}&background=0D9488&color=fff`} alt={santri.nama_santri} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{santri.nama_santri}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{santri.nis}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={santri.status_santri} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">{santri.nama_bapak || 'Wali tidak diisi'}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{santri.no_hp_bapak || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {santri.tahun_ke === 'Lulus' ? 'Lulus' : (santri.tahun_ke ? `Tahun ke-${santri.tahun_ke}` : 'N/A')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                    <Link href={route("santris.show", santri.id)} className="inline-flex items-center p-2 border border-transparent rounded-full text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-gray-700 transition-all" title="Detail">
                                                        <FiEye size={16} />
                                                    </Link>
                                                    <Link href={route("santris.edit", santri.id)} className="inline-flex items-center p-2 border border-transparent rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 transition-all" title="Edit">
                                                        <FiEdit2 size={16} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(santri.id, santri.nama_santri)} className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition-all" title="Hapus">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <FiSearch size={40} className="text-gray-400" />
                                                    <span>Tidak ada data santri yang cocok dengan filter Anda.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {santris.total > 0 && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                <Pagination links={santris.links} total={santris.total} from={santris.from} to={santris.to} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
