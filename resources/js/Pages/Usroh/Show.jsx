import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ auth, usroh, availableSantris }) {
    const { data, setData, post, processing, errors } = useForm({
        santri_id: '',
    });

    const addSantriSubmit = (e) => {
        e.preventDefault();
        post(route('usrohs.addSantri', usroh.id), {
            preserveScroll: true,
            onSuccess: () => setData('santri_id', ''),
        });
    };

    const removeSantri = (santriId) => {
        if (confirm('Yakin ingin mengeluarkan santri ini dari kelompok?')) {
            post(route('usrohs.removeSantri', { usroh: usroh.id, santri_id: santriId }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link href={route('usrohs.index')} className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Detail Kelompok: {usroh.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Usroh ${usroh.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Add Santri Form */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Tambah Anggota</h3>
                        <form onSubmit={addSantriSubmit} className="mt-4 flex items-start gap-4">
                            <div className="flex-grow">
                                <select id="santri_id" value={data.santri_id} onChange={(e) => setData('santri_id', e.target.value)} className="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                    <option value="">-- Pilih Santri yang Tersedia --</option>
                                    {availableSantris.map(santri => <option key={santri.id} value={santri.id}>{santri.nama_santri} (NIS: {santri.nis})</option>)}
                                </select>
                                {errors.santri_id && <p className="text-red-500 text-xs mt-1">{errors.santri_id}</p>}
                            </div>
                            <PrimaryButton disabled={processing || !data.santri_id}><UserPlusIcon className="w-5 h-5 mr-2" /> Tambah</PrimaryButton>
                        </form>
                    </div>

                    {/* Member List */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Daftar Anggota ({usroh.santris.length} orang)</h3>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Nama Santri</th>
                                        <th className="px-6 py-3">NIS</th>
                                        <th className="px-6 py-3">Kelas</th>
                                        <th className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usroh.santris.length > 0 ? usroh.santris.map(santri => (
                                        <tr key={santri.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{santri.nama_santri}</td>
                                            <td className="px-6 py-4">{santri.nis}</td>
                                            <td className="px-6 py-4">{santri.kelas?.nama_kelas || 'N/A'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => removeSantri(santri.id)} className="text-red-500 hover:text-red-700"><UserMinusIcon className="w-5 h-5"/></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center p-6 text-gray-500">Belum ada anggota di kelompok ini.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
