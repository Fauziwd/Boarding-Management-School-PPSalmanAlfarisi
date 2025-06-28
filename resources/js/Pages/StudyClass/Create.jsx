import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Create({ auth, mudarrises, academicYears, kitabNames }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        teacher_id: '',
        academic_year_id: academicYears[0]?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('study-classes.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Buat Kelas Baru" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                     <div className="flex items-center mb-4">
                        <Link href={route('study-classes.index')} className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-full">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl">Buat Kelas Baru</h2>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Kelas (berdasarkan Kitab)" />
                                {/* PERBAIKAN: Menggunakan dropdown untuk nama kelas */}
                                <select 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    <option value="">-- Pilih Kitab untuk Kelas --</option>
                                    {kitabNames.map(kitab => (
                                        <option key={kitab} value={`Kelas ${kitab}`}>Kelas {kitab}</option>
                                    ))}
                                </select>
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="teacher_id" value="Pilih Mudaris (Guru)" />
                                <select id="teacher_id" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="">Pilih Mudaris</option>
                                    {mudarrises.map(teacher => <option key={teacher.id} value={teacher.id}>{teacher.user.name}</option>)}
                                </select>
                                <InputError message={errors.teacher_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="academic_year_id" value="Tahun Ajaran" />
                                <select id="academic_year_id" value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                    {academicYears.map(year => <option key={year.id} value={year.id}>{year.year} - {year.semester}</option>)}
                                </select>
                                <InputError message={errors.academic_year_id} className="mt-2" />
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Kelas'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
