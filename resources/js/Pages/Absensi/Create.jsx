import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Create({ auth, halaqohs, studyClasses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        attendance_date: new Date().toISOString().slice(0, 10),
        group_type: '',
        group_id: '',
        attendances: [],
    });

    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        if (data.group_type === 'halaqoh') {
            setGroups(halaqohs);
        } else if (data.group_type === 'study_class') {
            setGroups(studyClasses);
        } else {
            setGroups([]);
        }
        setData('group_id', '');
        setStudents([]);
    }, [data.group_type]);

    useEffect(() => {
        if (data.group_id && data.group_type) {
            setLoadingStudents(true);
            axios.get(route('api.attendance.getStudents'), {
                params: {
                    group_type: data.group_type,
                    group_id: data.group_id,
                    date: data.attendance_date,
                }
            }).then(response => {
                setStudents(response.data.students);
                setData('attendances', response.data.students.map(s => ({
                    santri_id: s.id,
                    status: s.attendance_status || 'Hadir',
                    notes: '',
                })));
            }).finally(() => setLoadingStudents(false));
        }
    }, [data.group_id, data.attendance_date]);

    const handleStatusChange = (santriId, status) => {
        setData('attendances', data.attendances.map(att => 
            att.santri_id === santriId ? { ...att, status } : att
        ));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('absensi.store'), {
            onSuccess: () => Swal.fire('Berhasil!', 'Absensi telah disimpan.', 'success')
        });
    };
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Input Absensi" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <InputLabel htmlFor="group_type" value="Tipe Kelompok" />
                                <select id="group_type" value={data.group_type} onChange={e => setData('group_type', e.target.value)} className="mt-1 block w-full rounded-md">
                                    <option value="">-- Pilih Tipe --</option>
                                    <option value="halaqoh">Halaqoh</option>
                                    <option value="study_class">Kelas</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="group_id" value="Nama Kelompok" />
                                <select id="group_id" value={data.group_id} onChange={e => setData('group_id', e.target.value)} disabled={!data.group_type} className="mt-1 block w-full rounded-md">
                                    <option value="">-- Pilih Kelompok --</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name} (Pengajar: {g.teacher.user.name})</option>)}
                                </select>
                            </div>
                             <div>
                                <InputLabel htmlFor="attendance_date" value="Tanggal" />
                                <input type="date" id="attendance_date" value={data.attendance_date} onChange={e => setData('attendance_date', e.target.value)} className="mt-1 block w-full rounded-md" />
                            </div>
                        </div>

                        {loadingStudents && <p>Memuat daftar santri...</p>}
                        
                        {students.length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium mb-4">Daftar Santri</h3>
                                <div className="space-y-4">
                                    {students.map((student, index) => (
                                        <div key={student.id} className="grid grid-cols-3 gap-4 items-center">
                                            <span>{student.nama_santri}</span>
                                            <div className="col-span-2 flex flex-wrap gap-2">
                                                {['Hadir', 'Sakit', 'Izin', 'Alpa'].map(status => (
                                                    <label key={status} className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-all ${data.attendances[index]?.status === status ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                        <input type="radio" value={status} name={`status-${student.id}`} checked={data.attendances[index]?.status === status} onChange={() => handleStatusChange(student.id, status)} className="sr-only"/>
                                                        {status}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}