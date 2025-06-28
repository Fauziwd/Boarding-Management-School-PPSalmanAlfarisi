import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, teacher }) {
    const { data, setData, put, processing, errors } = useForm({
        // Inisialisasi dengan data yang ada
        roles: teacher.roles || [], 
        phone_number: teacher.phone_number || '',
        address: teacher.address || '',
    });

    const teacherRoleOptions = ['Murobbi', 'Muhafidz', 'Mudaris'];

    // Fungsi untuk menangani perubahan pada checkbox
    const handleRoleChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setData('roles', [...data.roles, value]);
        } else {
            setData('roles', data.roles.filter((role) => role !== value));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('teachers.update', teacher.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Guru - ${teacher.user.name}`} />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center mb-4">
                        <Link href={route('teachers.index')} className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Data Guru: {teacher.user.name}</h2>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="user_name" value="Nama User (Tidak bisa diubah)" />
                                <TextInput id="user_name" value={teacher.user.name} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700" disabled />
                            </div>

                            <div>
                                <InputLabel value="Peran Guru (Bisa lebih dari satu)" />
                                <div className="mt-2 space-y-2">
                                    {teacherRoleOptions.map((role) => (
                                        <label key={role} className="flex items-center">
                                            <Checkbox
                                                name="roles"
                                                value={role}
                                                checked={data.roles.includes(role)}
                                                onChange={handleRoleChange}
                                            />
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{role}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.roles} className="mt-2" />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="phone_number" value="Nomor Telepon (Opsional)" />
                                <TextInput id="phone_number" type="text" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} className="mt-1 block w-full" />
                            </div>
                            <div>
                                <InputLabel htmlFor="address" value="Alamat (Opsional)" />
                                <textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} className="mt-1 block w-full h-24 border-gray-300 rounded-md shadow-sm dark:text-white dark:bg-gray-900 dark:border-gray-700" />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>
                                    <PencilSquareIcon className="w-5 h-5 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Update Guru'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
