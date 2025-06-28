import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
// Impor data kitab dari file JSON Anda
import dataKitabDurus from '@/data/dataKitabDurus.json';

export default function Create({ auth, santris, selectedSantri }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Akademik", href: route("akademik.index") },
        { label: "Tambah" },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        santri_id: selectedSantri?.id || '',
        kitab: '',
        bab: '',
        nilai: '',
        catatan: '',
        status: 'Belum Selesai',
        // State baru untuk menyimpan tahun angkatan yang dipilih
        year: selectedSantri ? selectedSantri.nis.toString().slice(0, 4) : "",
    });

    const uniqueKitabs = [...new Set(dataKitabDurus.map(item => item.kitab))];
    const [filteredBab, setFilteredBab] = useState([]);
    const [isNilaiEnabled, setIsNilaiEnabled] = useState(false);
    
    // --- LOGIKA BARU UNTUK FILTER TAHUN ANGKATAN ---
    const [uniqueYears, setUniqueYears] = useState([]);
    const [filteredSantris, setFilteredSantris] = useState([]);

    // Mengambil tahun unik dari NIS untuk dropdown filter
    useEffect(() => {
        if (santris) {
            const years = [...new Set(santris.map((s) => s.nis.toString().slice(0, 4)))].sort();
            setUniqueYears(years);
        }
    }, [santris]);

    // Filter santri berdasarkan tahun yang dipilih
    useEffect(() => {
        if (data.year && santris) {
            const filtered = santris.filter((s) => s.nis.toString().startsWith(data.year));
            setFilteredSantris(filtered);
        } else {
            // Jika ada santri yang sudah terpilih dari awal, tampilkan dia di list
            setFilteredSantris(selectedSantri ? [selectedSantri] : []);
        }
        // Reset pilihan santri jika tahun berubah
        if (!selectedSantri) {
            setData('santri_id', '');
        }
    }, [data.year, santris]);
    // --- AKHIR LOGIKA BARU ---

    useEffect(() => {
        if (data.kitab) {
            const babOptions = dataKitabDurus.filter(k => k.kitab === data.kitab).map(k => k.bab);
            setFilteredBab(babOptions);
            setData('bab', ''); 
        } else {
            setFilteredBab([]);
        }
    }, [data.kitab]);

    // --- PERBAIKAN: Logika baru untuk mengontrol input nilai ---
    // useEffect ini sekarang memantau perubahan pada 'status'
    useEffect(() => {
        // Cek apakah status yang dipilih adalah "Ikhtibar" ATAU "Tamat"
        const enableNilai = data.status === 'Tamat';
        setIsNilaiEnabled(enableNilai);

        // Jika input nilai dinonaktifkan, kosongkan nilainya
        if (!enableNilai) {
            setData('nilai', '');
        }
    }, [data.status]); // <-- Bergantung pada perubahan 'status'


    const submit = (e) => {
        e.preventDefault();
        post(route('akademik.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data akademik berhasil disimpan.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Akademik" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 md:p-8 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6">
                                {/* --- PENAMBAHAN DROPDOWN TAHUN ANGKATAN --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="year" value="Filter Santri per Tahun Angkatan (NIS)" />
                                        <select
                                            id="year" name="year"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"
                                            value={data.year}
                                            onChange={(e) => setData("year", e.target.value)}
                                            disabled={!!selectedSantri}
                                        >
                                            <option value="">Pilih Tahun Angkatan</option>
                                            {uniqueYears.map((year) => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="santri_id" value="Santri" />
                                        <select
                                            id="santri_id" name="santri_id"
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 ${!!selectedSantri ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                                            value={data.santri_id}
                                            onChange={(e) => setData("santri_id", e.target.value)}
                                            disabled={!!selectedSantri || !data.year}
                                            required
                                        >
                                            <option value="">{data.year ? 'Pilih Santri' : 'Pilih Tahun Angkatan Dulu'}</option>
                                            {filteredSantris.map((s) => (
                                                <option key={s.id} value={s.id}>{s.nama_santri}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.santri_id} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="kitab" value="Kitab" />
                                        <select
                                            id="kitab" name="kitab" value={data.kitab}
                                            onChange={(e) => setData('kitab', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">-- Pilih Kitab --</option>
                                            {uniqueKitabs.map((kitabName) => (
                                                <option key={kitabName} value={kitabName}>{kitabName}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.kitab} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bab" value="Bab / Pembahasan" />
                                        <select
                                            id="bab" name="bab" value={data.bab}
                                            onChange={(e) => setData('bab', e.target.value)}
                                            disabled={!data.kitab || filteredBab.length === 0}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">{data.kitab ? 'Pilih Bab' : 'Pilih Kitab Dulu'}</option>
                                            {filteredBab.map((bab) => (
                                                <option key={bab} value={bab}>{bab}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.bab} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select id="status" name="status" value={data.status} onChange={(e) => setData('status', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                            <option value="Belum Selesai">Belum Selesai</option>
                                            <option value="Ikhtibar">Ikhtibar</option>
                                            <option value="Tamat">Tamat</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nilai" value="Nilai" />
                                        <TextInput 
                                            id="nilai" type="number" min="0" max="100" 
                                            value={data.nilai} 
                                            onChange={(e) => setData('nilai', e.target.value)} 
                                            className={`mt-1 block w-full ${!isNilaiEnabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                                            disabled={!isNilaiEnabled}
                                            required={isNilaiEnabled}
                                            placeholder={!isNilaiEnabled ? 'Sudah Selesai?' : '0-100'}
                                        />
                                        <InputError message={errors.nilai} className="mt-2" />
                                    </div>
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="catatan" value="Catatan (Opsional)" />
                                    <textarea id="catatan" value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="mt-1 block w-full h-24 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm" />
                                    <InputError message={errors.catatan} className="mt-2" />
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
