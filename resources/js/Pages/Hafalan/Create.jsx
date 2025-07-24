import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

// Komponen Input Halaman yang baru dan lebih efektif
const HalamanInput = ({ value, onChange, error }) => {
    const [halaman, setHalaman] = useState(() => {
        const match = value.match(/^(\d+)([AB])$/i);
        return {
            nomor: match ? match[1] : '1',
            sisi: match ? match[2].toUpperCase() : 'A',
        };
    });

    useEffect(() => {
        onChange(`${halaman.nomor}${halaman.sisi}`);
    }, [halaman]);

    const handleNomorChange = (e) => setHalaman(prev => ({ ...prev, nomor: e.target.value }));
    const handleSisiChange = (e) => setHalaman(prev => ({ ...prev, sisi: e.target.value }));

    return (
        <div className="flex items-center gap-2">
            <select value={halaman.nomor} onChange={handleNomorChange} className="w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white">
                {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={halaman.sisi} onChange={handleSisiChange} className="w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white">
                <option value="A">A</option>
                <option value="B">B</option>
            </select>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
};

export default function Create({ auth, santris, selectedSantri }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan", href: route("hafalan.index") },
        { label: "Tambah Setoran" },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        santri_id: selectedSantri?.id || '',
        juz: '',
        halaman: '1A',
        nilai: '',
    });

    const [yearFilter, setYearFilter] = useState(selectedSantri ? String(selectedSantri.nis).slice(0, 4) : '');
    const [usrohInfo, setUsrohInfo] = useState('');

    const uniqueYears = useMemo(() => {
        if (!santris) return [];
        return [...new Set(santris.map(s => String(s.nis).slice(0, 4)))].sort((a, b) => b - a);
    }, [santris]);

    const filteredSantris = useMemo(() => {
        if (!yearFilter) return []; // Jangan tampilkan santri jika tahun belum dipilih
        return santris.filter(s => String(s.nis).startsWith(yearFilter));
    }, [yearFilter, santris]);

    useEffect(() => {
        if (data.santri_id) {
            const selected = santris.find(s => s.id === parseInt(data.santri_id));
            if (selected && selected.usrohs && selected.usrohs.length > 0) {
                setUsrohInfo(selected.usrohs.map(u => u.nama_usroh).join(', '));
            } else {
                setUsrohInfo('Santri belum terdaftar di usroh manapun.');
            }
        } else {
            setUsrohInfo('');
        }
    }, [data.santri_id, santris]);
    
    useEffect(() => {
        if (!selectedSantri) {
            setData('santri_id', '');
        }
    }, [yearFilter]);

    const submit = (e) => {
        e.preventDefault();
        post(route('hafalan.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!', text: 'Data hafalan berhasil disimpan.',
                    icon: 'success', timer: 2000, showConfirmButton: false
                });
                reset('juz', 'nilai');
                setData('halaman', '1A');
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Setoran Hafalan" />
            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formulir Setoran Hafalan</h1>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="yearFilter" value="Filter Santri per Tahun Masuk" />
                                    <select id="yearFilter" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" disabled={!!selectedSantri}>
                                        <option value="">Pilih Tahun Angkatan</option>
                                        {uniqueYears.map((year) => (<option key={year} value={year}>Angkatan {year}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="santri_id" value="Santri" isRequired />
                                    <select id="santri_id" value={data.santri_id} onChange={(e) => setData('santri_id', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" disabled={!!selectedSantri || !yearFilter}>
                                        <option value="">{yearFilter ? 'Pilih Santri' : 'Pilih Tahun Dulu'}</option>
                                        {filteredSantris.map((s) => (<option key={s.id} value={s.id}>{s.nama_santri} ({s.nis})</option>))}
                                    </select>
                                    <InputError message={errors.santri_id} className="mt-2" />
                                </div>
                            </div>

                            {usrohInfo && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-md">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <span className="font-semibold">Info Usroh:</span> {usrohInfo}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="juz" value="Juz" isRequired />
                                    <input type="number" id="juz" value={data.juz} onChange={(e) => setData('juz', e.target.value)} min="1" max="30" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" />
                                    <InputError message={errors.juz} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="halaman" value="Halaman" isRequired />
                                    <HalamanInput value={data.halaman} onChange={(val) => setData('halaman', val)} error={errors.halaman} />
                                </div>
                            </div>
                            <div>
                                <InputLabel htmlFor="nilai" value="Nilai" isRequired />
                                <input type="number" id="nilai" value={data.nilai} onChange={(e) => setData('nilai', e.target.value)} min="0" max="100" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white" />
                                <InputError message={errors.nilai} className="mt-2" />
                            </div>
                            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Setoran'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
