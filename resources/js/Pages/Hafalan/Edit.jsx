import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Swal from 'sweetalert2';

export default function Edit({ auth, hafalan }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan", href: route("hafalan.index") },
        { label: "Edit" },
    ];

    const { data, setData, put, errors, processing } = useForm({
        juz: hafalan.juz || "",
        halaman: hafalan.halaman || "",
        baris: hafalan.baris || "",
        nilai: hafalan.nilai || "",
        month: hafalan.month || new Date().toISOString().slice(0, 7),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("hafalan.update", { hafalan: hafalan.id }), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data hafalan berhasil diperbarui.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Hafalan" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 md:p-8 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="santri_name" value="Santri" />
                                    <TextInput id="santri_name" value={hafalan.santri.nama_santri} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700" disabled />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="month" value="Tanggal Setoran" />
                                            <TextInput id="month" name="month" type="month" className="mt-1 block w-full" value={data.month} onChange={(e) => setData("month", e.target.value)} required />
                                            <InputError className="mt-2" message={errors.month} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="juz" value="Juz" />
                                            <TextInput id="juz" name="juz" type="number" min="1" max="30" className="mt-1 block w-full" value={data.juz} onChange={(e) => setData("juz", e.target.value)} required />
                                            <InputError className="mt-2" message={errors.juz} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
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
                                    <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Update'}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
