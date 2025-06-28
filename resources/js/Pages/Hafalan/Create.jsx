import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";

export default function Create({ auth, santris, selectedSantri }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan", href: route("hafalan.index") },
        { label: "Tambah" },
    ];

    const { data, setData, post, errors, processing, wasSuccessful } = useForm({
        santri_id: selectedSantri?.id || "",
        juz: "",
        halaman: "", // Baru
        baris: "",   // Baru
        nilai: "",   // Baru
        month: new Date().toISOString().slice(0, 7), // Default ke bulan ini
        year: selectedSantri ? selectedSantri.nis.toString().slice(0, 4) : "", // Untuk filter
    });

    const [uniqueYears, setUniqueYears] = useState([]);
    const [filteredSantris, setFilteredSantris] = useState([]);

    // Ambil tahun unik dari NIS untuk dropdown filter
    useEffect(() => {
        const years = [...new Set(santris.map((s) => s.nis.toString().slice(0, 4)))].sort();
        setUniqueYears(years);
    }, [santris]);

    // Filter santri berdasarkan tahun yang dipilih
    useEffect(() => {
        if (data.year) {
            const filtered = santris.filter((s) => s.nis.toString().startsWith(data.year));
            setFilteredSantris(filtered);
        } else {
            setFilteredSantris(selectedSantri ? [selectedSantri] : []);
        }
    }, [data.year, santris, selectedSantri]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("hafalan.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data hafalan berhasil ditambahkan.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Terdapat kesalahan pada input Anda.',
                    icon: 'error',
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Hafalan" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 md:p-8 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="year" value="Filter Santri per Tahun Angkatan (NIS)" />
                                            <select
                                                id="year" name="year"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"
                                                value={data.year}
                                                onChange={(e) => setData("year", e.target.value)}
                                            >
                                                <option value="">Pilih Tahun Angkatan</option>
                                                {uniqueYears.map((year) => <option key={year} value={year}>{year}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="santri_id" value="Santri" />
                                            <select
                                                id="santri_id" name="santri_id"
                                                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 ${selectedSantri ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                                value={data.santri_id}
                                                onChange={(e) => setData("santri_id", e.target.value)}
                                                disabled={!!selectedSantri}
                                                required
                                            >
                                                <option value="">{data.year ? 'Pilih Santri' : 'Pilih Tahun Angkatan Dulu'}</option>
                                                {filteredSantris.map((s) => <option key={s.id} value={s.id}>{s.nama_santri}</option>)}
                                            </select>
                                            <InputError className="mt-2" message={errors.santri_id} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="month" value="Tanggal Setoran" />
                                            <TextInput id="month" name="month" type="month" className="mt-1 block w-full" value={data.month} onChange={(e) => setData("month", e.target.value)} required />
                                            <InputError className="mt-2" message={errors.month} />
                                        </div>
                                    </div>

                                    {/* Kolom Kanan */}
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="juz" value="Juz" />
                                            <TextInput id="juz" name="juz" type="number" min="1" max="30" className="mt-1 block w-full" value={data.juz} onChange={(e) => setData("juz", e.target.value)} required />
                                            <InputError className="mt-2" message={errors.juz} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="halaman" value="Halaman" />
                                                <TextInput id="halaman" name="halaman" type="text" className="mt-1 block w-full" value={data.halaman} onChange={(e) => setData("halaman", e.target.value)} />
                                                <InputError className="mt-2" message={errors.halaman} />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="baris" value="Baris" />
                                                <TextInput id="baris" name="baris" type="text" className="mt-1 block w-full" value={data.baris} onChange={(e) => setData("baris", e.target.value)} />
                                                <InputError className="mt-2" message={errors.baris} />
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="nilai" value="Nilai" />
                                            <TextInput id="nilai" name="nilai" type="number" min="0" max="100" className="mt-1 block w-full" value={data.nilai} onChange={(e) => setData("nilai", e.target.value)} required />
                                            <InputError className="mt-2" message={errors.nilai} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
