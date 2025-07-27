import React from "react";

// Komponen untuk menampilkan detail data diri santri dalam bentuk tabel
const Datadiri = ({ santri }) => {
    // Fungsi untuk memformat tanggal menjadi format "DD NamaBulan YYYY"
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    // Fungsi untuk mendapatkan warna badge berdasarkan status santri
    const getStatusColor = (status) => {
        const colors = {
            Aktif: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
            Lulus: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
            Keluar: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Baris Data Pribadi */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-tl-xl">
                            NIS
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.nis || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Nama Lengkap
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.nama_santri || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Status Santri
                        </th>
                        <td className="px-6 py-3 text-sm">
                            <span
                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                    santri.status_santri
                                )}`}
                            >
                                {santri.status_santri || "N/A"}
                            </span>
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Tahun Ke
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">
                            {santri.tahun_ke
                                ? `Tahun ke-${santri.tahun_ke}`
                                : "Belum Dihitung"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Tempat, Tanggal Lahir
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.tempat_lahir || "-"},{" "}
                            {formatDate(santri.tanggal_lahir)}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Anak Ke
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.anak_ke || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Status Yatim/Piatu
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.status_yatim_piatu || "-"}
                        </td>
                    </tr>

                    {/* Baris Data Orang Tua */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Nama Ayah
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.nama_bapak || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Pekerjaan Ayah
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.pekerjaan_bapak || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            No. HP Ayah
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.no_hp_bapak || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Nama Ibu
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.nama_ibu || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            Pekerjaan Ibu
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.pekerjaan_ibu || "-"}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                            No. HP Ibu
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {santri.no_hp_ibu || "-"}
                        </td>
                    </tr>

                    {/* Baris Data Alamat */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-bl-xl">
                            Alamat
                        </th>
                        <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100 rounded-br-xl">
                            {santri.alamat || ""}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Datadiri;
