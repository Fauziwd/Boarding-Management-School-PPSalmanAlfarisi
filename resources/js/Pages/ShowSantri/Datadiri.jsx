import React from 'react';

const Datadiri = ({ santri }) => {
    return (
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <tbody>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">NIS</th>
                    <td className="px-4 py-2">{santri.nis}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Nama</th>
                    <td className="px-4 py-2">{santri.nama}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Tahun Lulus</th>
                    <td className="px-4 py-2">{santri.tahun_lulus}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Tempat Lahir</th>
                    <td className="px-4 py-2">{santri.tempat_lahir}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Tanggal Lahir</th>
                    <td className="px-4 py-2">{santri.tanggal_lahir}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Anak Ke</th>
                    <td className="px-4 py-2">{santri.anak_ke}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Status Yatim/Piatu</th>
                    <td className="px-4 py-2">{santri.status_yatim_piatu}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Nama Bapak</th>
                    <td className="px-4 py-2">{santri.nama_bapak}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Pekerjaan Bapak</th>
                    <td className="px-4 py-2">{santri.pekerjaan_bapak}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">No HP Bapak</th>
                    <td className="px-4 py-2">{santri.no_telpon_bapak}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Nama Ibu</th>
                    <td className="px-4 py-2">{santri.nama_ibu}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Pekerjaan Ibu</th>
                    <td className="px-4 py-2">{santri.pekerjaan_ibu}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">No HP Ibu</th>
                    <td className="px-4 py-2">{santri.no_telpon_ibu}</td>
                </tr>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">Alamat</th>
                    <td className="px-4 py-2">
                        {santri.alamat}, {santri.kelurahan}, {santri.kecamatan}, {santri.kabupaten_kota}, {santri.provinsi} - {santri.kode_pos}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default Datadiri;