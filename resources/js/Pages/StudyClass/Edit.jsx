import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Edit({ auth, usroh, mudaris, academicYears }) {
    const { data, setData, put, processing, errors } = useForm({
        name: usroh.name || '',
        mudaris_id: usroh.mudaris_id || '',
        academic_year_id: usroh.academic_year_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('usrohs.update', usroh.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link href={route('usrohs.index')} className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Kelompok Usroh</h2>
                </div>
            }
        >
            <Head title="Edit Usroh" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Kelompok Usroh" />
                                <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" autoFocus />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="mudaris_id" value="Pilih Mudaris" />
                                <select id="mudaris_id" value={data.mudaris_id} onChange={(e) => setData('mudaris_id', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                    <option value="">-- Tidak Diatur --</option>
                                    {mudarisis.map((mudaris) => <option key={mudaris.id} value={mudaris.id}>{mudaris.user.name}</option>)}
                                </select>
                                <InputError message={errors.mudaris_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="academic_year_id" value="Tahun Ajaran" />
                                <select id="academic_year_id" value={data.academic_year_id} onChange={(e) => setData('academic_year_id', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                    {academicYears.map((year) => <option key={year.id} value={year.id}>{year.year} - {year.semester}</option>)}
                                </select>
                                <InputError message={errors.academic_year_id} className="mt-2" />
                            </div>
                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Update'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
