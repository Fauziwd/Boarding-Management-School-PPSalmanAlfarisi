import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Create({ auth, halaqohs, studyClasses }) {
    const { data, setData, post, processing, errors } = useForm({
        attendance_date: new Date().toISOString().slice(0, 10),
        group_type: '',
        group_id: '',
        attendances: [],
    });

    const [groups, setGroups] = useState([]);
    const [santries, setSantries] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // Efek untuk mengubah daftar grup berdasarkan tipe yang dipilih
    useEffect(() => {
        if (data.group_type === 'halaqoh') {
            setGroups(halaqohs);
        } else if (data.group_type === 'study_class') {
            setGroups(studyClasses);
        } else {
            setGroups([]);
        }
        setData('group_id', '');
        setSantries([]);
    }, [data.group_type]);

    // Efek untuk mengambil daftar santri saat grup atau tanggal berubah
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
                setSantries(response.data.students);
                
                // LOGIKA BARU: Hanya tambahkan santri yang BELUM diabsen ke dalam form `attendances`
                const newAttendances = response.data.students
                    .filter(s => !s.existing_attendance) // Filter santri yang belum ada data absensinya
                    .map(s => ({
                        santri_id: s.id,
                        status: 'Hadir', // Default status untuk yang baru
                        notes: '',
                    }));
                setData('attendances', newAttendances);

            }).catch(error => {
                console.error("Gagal memuat daftar santri:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Memuat Data',
                    text: 'Terjadi kesalahan saat memuat daftar santri.',
                    background: document.body.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                    color: document.body.classList.contains('dark') ? '#FFFFFF' : '#1F2937'
                });
            }).finally(() => setLoadingStudents(false));
        }
    }, [data.group_id, data.attendance_date]);

    // Menangani perubahan status absensi
    const handleStatusChange = (santriId, status) => {
        setData('attendances', data.attendances.map(att =>
            att.santri_id === santriId ? { ...att, status } : att
        ));
    };

    // Menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Cek jika tidak ada santri yang perlu diabsen
        if (data.attendances.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Informasi',
                text: 'Semua santri di kelompok ini sudah diabsen untuk tanggal yang dipilih.',
                background: document.body.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                color: document.body.classList.contains('dark') ? '#FFFFFF' : '#1F2937'
            });
            return;
        }
        post(route('absensi.store'), {
            onSuccess: () => Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Absensi telah disimpan.',
                background: document.body.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                color: document.body.classList.contains('dark') ? '#FFFFFF' : '#1F2937'
            }),
            onError: (err) => {
                const message = err.group_id || 'Terjadi kesalahan saat menyimpan.';
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: message,
                    background: document.body.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                    color: document.body.classList.contains('dark') ? '#FFFFFF' : '#1F2937'
                });
            },
        });
    };

    // Palet warna untuk status
    const statusColors = {
        'Hadir': 'bg-emerald-500 text-white',
        'Sakit': 'bg-amber-500 text-white',
        'Izin': 'bg-blue-500 text-white',
        'Alpa': 'bg-red-500 text-white',
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Input Absensi" />
            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                            <h1 className="text-2xl font-bold">Input Absensi Santri</h1>
                            <p className="opacity-90">Isi form berikut untuk mencatat kehadiran santri</p>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* ... Form Pilihan Grup dan Tanggal ... */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="group_type" value="Tipe Kelompok" className="font-medium" />
                                    <select id="group_type" value={data.group_type} onChange={e => setData('group_type', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-emerald-500 p-2.5 transition duration-150">
                                        <option value="">-- Pilih Tipe --</option>
                                        <option value="halaqoh">Halaqoh</option>
                                        <option value="study_class">Kelas</option>
                                    </select>
                                    <InputError message={errors.group_type} className="mt-1" />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="group_id" value="Nama Kelompok" className="font-medium" />
                                    <select id="group_id" value={data.group_id} onChange={e => setData('group_id', e.target.value)} disabled={!data.group_type} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-emerald-500 p-2.5 transition duration-150">
                                        <option value="">-- Pilih Kelompok --</option>
                                        {groups.map(g => ( <option key={g.id} value={g.id}>{g.name} (Pengajar: {g.teacher?.user?.name ?? 'N/A'})</option> ))}
                                    </select>
                                    <InputError message={errors.group_id} className="mt-1" />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="attendance_date" value="Tanggal Absensi" className="font-medium" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <input type="date" id="attendance_date" value={data.attendance_date} onChange={e => setData('attendance_date', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500" />
                                    </div>
                                    <InputError message={errors.attendance_date} className="mt-1" />
                                </div>
                            </div>

                            {loadingStudents && ( <div className="flex flex-col items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div><p className="text-gray-600 dark:text-gray-300">Memuat daftar santri...</p></div> )}
                            
                            {santries.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Daftar Santri</h3>
                                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100 text-sm font-medium rounded-full">{santries.length} Santri</span>
                                    </div>
                                    <div className="space-y-4">
                                        {santries.map((santri) => (
                                            <div key={santri.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="md:col-span-4 flex items-center space-x-3">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-100 font-medium">{santri.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">{santri.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {santri.id}</p>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-8">
                                                    {/* --- LOGIKA TAMPILAN KONDISIONAL --- */}
                                                    {santri.existing_attendance ? (
                                                        <div className="w-full text-sm text-amber-800 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 p-3 rounded-lg flex items-center gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Telah diabsen ({santri.existing_attendance.status}) oleh: <strong>{santri.existing_attendance.teacher_name}</strong>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {['Hadir', 'Sakit', 'Izin', 'Alpa'].map(status => {
                                                                const attendanceData = data.attendances.find(a => a.santri_id === santri.id);
                                                                return (
                                                                    <button type="button" key={status} onClick={() => handleStatusChange(santri.id, status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${attendanceData?.status === status ? `${statusColors[status]} ring-2 ring-offset-2 ring-emerald-500/50` : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                                                        {status}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-8">
                                        <PrimaryButton disabled={processing || data.attendances.length === 0} className="px-6 py-3 text-base font-medium shadow-lg hover:shadow-emerald-500/20 transition-all">
                                            {processing ? 'Menyimpan...' : `Simpan Absensi (${data.attendances.length} Santri)`}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
