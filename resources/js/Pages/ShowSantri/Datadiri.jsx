import React from "react";

const Datadiri = ({ santri }) => {
    return (
        <table className="min-w-full border border-gray-300 dark:border-gray-800 shadow-xl">
            <tbody>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold rounded-tl-xl bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        NIS
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600 rounded-tr-xl">
                        {santri.nis}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Nama
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.nama}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Tahun Lulus
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.tahun_lulus}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Tempat Lahir
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.tempat_lahir}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Tanggal Lahir
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.tanggal_lahir}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Anak Ke
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.anak_ke}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Status Yatim/Piatu
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.status_yatim_piatu}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Nama Bapak
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.nama_bapak}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Pekerjaan Bapak
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.pekerjaan_bapak}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        No HP Bapak
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.no_telpon_bapak}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Nama Ibu
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.nama_ibu}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Pekerjaan Ibu
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.pekerjaan_ibu}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        No HP Ibu
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600">
                        {santri.no_telpon_ibu}
                    </td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                    <th className="px-4 py-2 text-left font-semibold rounded-bl-xl bg-teal-700 text-white dark:text-white dark:bg-gray-900/50">
                        Alamat
                    </th>
                    <td className="px-4 py-2 dark:bg-gray-600 rounded-br-xl">
                        {santri.alamat}, {santri.kelurahan}, {santri.kecamatan},{" "}
                        {santri.kabupaten_kota}, {santri.provinsi} -{" "}
                        {santri.kode_pos}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default Datadiri;
