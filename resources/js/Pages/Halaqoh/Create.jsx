import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, muhafidzs, academicYears }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        teacher_id: '',
        academic_year_id: academicYears[0]?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('halaqohs.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Buat Halaqoh Baru</h2>}>
            <Head title="Buat Halaqoh" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Halaqoh" />
                                <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" autoFocus />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="teacher_id" value="Pilih Muhafidz" />
                                <select id="teacher_id" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="">Pilih Muhafidz</option>
                                    {muhafidzs.map(teacher => <option key={teacher.id} value={teacher.id}>{teacher.user.name}</option>)}
                                </select>
                                <InputError message={errors.teacher_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="academic_year_id" value="Tahun Ajaran" />
                                <select id="academic_year_id" value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    {academicYears.map(year => <option key={year.id} value={year.id}>{year.year} - {year.semester}</option>)}
                                </select>
                                <InputError message={errors.academic_year_id} className="mt-2" />
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );  };