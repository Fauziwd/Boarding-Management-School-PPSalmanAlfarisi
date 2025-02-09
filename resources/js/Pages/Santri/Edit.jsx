import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

const Edit = ({ auth, santri, hafalan, akademik }) => {
    const { data, setData, patch, processing, errors } = useForm({
        nama: santri.nama || "",
        tempat_lahir: santri.tempat_lahir || "",
        tanggal_lahir: santri.tanggal_lahir || "",
        tahun_lulus: santri.tahun_lulus || "",
        hafalan: hafalan || [],
        akademik: akademik || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('santris.update', santri.id), {
            onSuccess: () => alert("Data santri berhasil diperbarui."),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Santri" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                            <h2 className="text-2xl font-bold mb-4">Edit Data Santri</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama" />
                                    <TextInput
                                        id="nama"
                                        name="nama"
                                        className="mt-1 block w-full"
                                        value={data.nama}
                                        onChange={(e) => setData("nama", e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                                    <TextInput
                                        id="tempat_lahir"
                                        name="tempat_lahir"
                                        className="mt-1 block w-full"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData("tempat_lahir", e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.tempat_lahir} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />
                                    <TextInput
                                        id="tanggal_lahir"
                                        name="tanggal_lahir"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData("tanggal_lahir", e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.tanggal_lahir} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tahun_lulus" value="Tahun Lulus" />
                                    <TextInput
                                        id="tahun_lulus"
                                        name="tahun_lulus"
                                        className="mt-1 block w-full"
                                        value={data.tahun_lulus}
                                        onChange={(e) => setData("tahun_lulus", e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.tahun_lulus} className="mt-2" />
                                </div>
                                {/* <div>
                                    <InputLabel htmlFor="hafalan" value="Capaian Hafalan" />
                                    <TextInput
                                        id="hafalan"
                                        name="hafalan"
                                        className="mt-1 block w-full"
                                        value={data.hafalan}
                                        onChange={(e) => setData("hafalan", e.target.value)}
                                    />
                                    <InputError message={errors.hafalan} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="akademik" value="Capaian Akademik" />
                                    <TextInput
                                        id="akademik"
                                        name="akademik"
                                        className="mt-1 block w-full"
                                        value={data.akademik}
                                        onChange={(e) => setData("akademik", e.target.value)}
                                    />
                                    <InputError message={errors.akademik} className="mt-2" />
                                </div> */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Update</PrimaryButton>
                                    <Link href="/santris" className="ml-3 text-gray-600 dark:text-gray-400">
                                        Kembali
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;