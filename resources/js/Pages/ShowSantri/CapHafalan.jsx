// import React from 'react';

// const CapHafalan = ({ hafalan }) => {
//     return (
//         <table className="min-w-full border border-gray-300 dark:border-gray-700">
//             <tbody>
//                 {hafalan.map((item, index) => (
//                     <tr key={index} className="border-b border-gray-300 dark:border-gray-700">
//                         <th className="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-700">{item.nama}</th>
//                         <td className="px-4 py-2">{item.detail}</td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// };

// export default CapHafalan;
import React from 'react';

const CapHafalan = ({ hafalan }) => {
    console.log(hafalan);  // Tambahkan log ini

    if (!hafalan) {
        return <div>Data hafalan tidak tersedia.</div>;
    }

    return (
        <div>
            {/* Render data hafalan */}
        </div>
    );
};

export default CapHafalan;