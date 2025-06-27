import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';

export default function KelasIndex({ auth, kelas, success, error }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, patch, delete: destroy, errors, reset, processing } = useForm({
        id: null,
        nama_kelas: '',
    });

    useEffect(() => {
        if (success) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: success, showConfirmButton: false, timer: 3000 });
        }
        if (error) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: error, showConfirmButton: false, timer: 3000 });
        }
    }, [success, error]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        reset();
    };

    const handleCreate = () => {
        setIsEditing(false);
        reset();
        openModal();
    };

    const handleEdit = (k) => {
        setIsEditing(true);
        setData({ id: k.id, nama_kelas: k.nama_kelas });
        openModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'kelas.update' : 'kelas.store';
        const params = isEditing ? [data.id] : [];
        const action = isEditing ? patch : post;

        action(route(routeName, ...params), {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        });
    };
    
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Menghapus kelas akan melepaskan semua santri dari kelas ini. Data tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('kelas.destroy', id), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Kelas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Kelas</h1>
                        <PrimaryButton onClick={handleCreate}><FiPlus className="mr-2" /> Tambah Kelas</PrimaryButton>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tahun Ke-</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah Santri</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {kelas.map((k) => (
                                    <tr key={k.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{k.nama_kelas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{k.santris_count} Santri</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleEdit(k)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit"><FiEdit size={18} /></button>
                                            <button onClick={() => handleDelete(k.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Hapus"><FiTrash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="nama_kelas" value="Tahun ke" />
                        <TextInput id="nama_kelas" value={data.nama_kelas} onChange={e => setData('nama_kelas', e.target.value)} className="mt-1 block w-full" required autoFocus />
                        <InputError message={errors.nama_kelas} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}