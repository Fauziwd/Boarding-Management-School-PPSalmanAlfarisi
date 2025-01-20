import React from 'react';
import AchievementIndex from '../Achievement/Index';

const CapAkademik = ({ auth, achievements }) => {
    if (!achievements || achievements.length === 0) {
        return <div>Belum ada pencapaian akademik yang tersedia.</div>;
    }

    return (
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead>
                <tr>
                    <th className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-bold text-gray-900 dark:text-gray-100">
                        Nama Pencapaian
                    </th>
                    <th className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-bold text-gray-900 dark:text-gray-100">
                        Deskripsi
                    </th>
                    <th className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-bold text-gray-900 dark:text-gray-100">
                        Tanggal
                    </th>
                </tr>
            </thead>
            <tbody>
                {achievements.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                            {item.title}
                        </td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                            {item.description}
                        </td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                            {item.date}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CapAkademik;