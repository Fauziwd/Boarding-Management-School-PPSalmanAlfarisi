import Pagination from "@/Components/Pagination";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import SweetAlert from "@/Components/SweetAlert"; // Import the SweetAlert component
import ToastComponent from "@/Components/ToastComponent"; // Import the ToastComponent
import axios from "axios";
import { useState } from "react";

export default function AchievementIndex({
    auth,
    achievements: initialAchievements,
}) {
    const [achievements, setAchievements] = useState(initialAchievements);
    const [toastMessage, setToastMessage] = useState("");

    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "Capaian" },
    ];

    const handleDelete = async (id, santriName) => {
        try {
            const response = await axios.delete(
                route("achievements.destroy", id)
            );
            if (response.data.success) {
                // Perbarui state untuk menghapus item dari daftar tanpa reload
                setAchievements((prevAchievements) => ({
                    ...prevAchievements,
                    data: prevAchievements.data.filter(
                        (item) => item.id !== id
                    ),
                    total: prevAchievements.total - 1,
                }));
                // Tampilkan ToastComponent
                setToastMessage(
                    `Pencapaian oleh ${santriName} berhasil dihapus.`
                );
            } else {
                throw new Error("Penghapusan gagal");
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat menghapus data:", error);
            setToastMessage(
                "Terjadi kesalahan, tidak dapat menghapus pencapaian."
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Daftar Pencapaian" />
            <ToastComponent message={toastMessage} />{" "}
            {/* Tempatkan ToastComponent di sini */}
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7 flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbs} />
                        <Link
                            href={route("achievements.create")}
                            className="hover:bg-teal-600 border rounded-md border-teal-500 text-white font-bold py-2 px-4"
                        >
                            Tambah Pencapaian
                        </Link>
                    </div>
                    <div className="p-7 flex justify-between items-center">
                        <label className="font-light text-gray-700 dark:text-gray-200">
                            Total Pencapaian:
                            <span className="px-2 py-1 ml-3 bg-gray-200 rounded dark:bg-gray-700">
                                {achievements.total}
                            </span>
                        </label>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="border-b-2 border-gray-200 min-w-full overflow-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Nama Santri
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-white">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.data.map(
                                        (
                                            {
                                                id,
                                                santri,
                                                type,
                                                title,
                                                description,
                                            },
                                            index
                                        ) => (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {santri.nama_santri}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {type}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {title}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    {description}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-white">
                                                    <Link
                                                        href={route(
                                                            "achievements.edit",
                                                            id
                                                        )}
                                                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <SweetAlert
                                                        title="Konfirmasi Penghapusan"
                                                        text={`Apakah Anda yakin ingin menghapus pencapaian oleh ${santri.nama_santri}?`}
                                                        icon="warning"
                                                        confirmButtonText="Ya, hapus!"
                                                        onConfirm={() =>
                                                            handleDelete(
                                                                id,
                                                                santri.nama_santri
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={achievements.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
