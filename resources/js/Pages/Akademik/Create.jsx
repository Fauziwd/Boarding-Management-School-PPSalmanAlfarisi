import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import dataKitabDurus from "@/data/dataKitabDurus.json"; // Import JSON data

export default function Create({ auth, santris }) {
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Akademik", href: "/akademik" },
        { label: "Data Baru" },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            santri_id: "",
            kitab: "",
            bab: "",
        });

    const [uniqueYears, setUniqueYears] = useState([]); // Tahun unik dari NIS
    const [filteredSantris, setFilteredSantris] = useState([]); // Santri yang difilter berdasarkan tahun
    const [filteredBab, setFilteredBab] = useState([]); // Bab yang difilter berdasarkan kitab
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);

    // Ambil tahun unik dari NIS
    useEffect(() => {
        const years = [
            ...new Set(santris.map((s) => s.nis.toString().slice(0, 4))),
        ];
        setUniqueYears(years);
    }, [santris]);

    // Filter santri berdasarkan tahun
    useEffect(() => {
        if (data.year) {
            const filtered = santris.filter((s) =>
                s.nis.toString().startsWith(data.year)
            );
            setFilteredSantris(filtered);
        } else {
            setFilteredSantris([]);
        }
    }, [data.year, santris]);

    // Filter bab berdasarkan kitab yang dipilih
    useEffect(() => {
        if (data.kitab) {
            const filtered = dataKitabDurus.filter((k) => k.kitab === data.kitab);
            setFilteredBab(filtered);
        } else {
            setFilteredBab([]);
        }
    }, [data.kitab]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Konversi nilai bab menjadi integer sebelum mengirim form
        post(route("akademik.store"), {
            ...data,
            bab: parseInt(data.bab, 10),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Tambah Akademik" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                {/* Input Tahun */}
                                <div>
                                    <InputLabel htmlFor="year" value="Tahun" />
                                    <select
                                        id="year"
                                        name="year"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        value={data.year}
                                        onChange={(e) =>
                                            setData("year", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Pilih Tahun</option>
                                        {uniqueYears.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.year}
                                    />
                                </div>

                                {/* Pilih Santri */}
                                <div>
                                    <InputLabel
                                        htmlFor="santri_id"
                                        value="Santri"
                                    />
                                    <select
                                        id="santri_id"
                                        name="santri_id"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        value={data.santri_id}
                                        onChange={(e) =>
                                            setData("santri_id", e.target.value)
                                        }
                                        disabled={!data.year}
                                        required
                                    >
                                        <option value="">Pilih Santri</option>
                                        {filteredSantris.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nama} - {s.nis}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.santri_id}
                                    />
                                </div>

                                {/* Kitab */}
                                <div>
                                    <InputLabel htmlFor="kitab" value="Kitab" />
                                    <select
                                        id="kitab"
                                        name="kitab"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        value={data.kitab}
                                        onChange={(e) =>
                                            setData("kitab", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Pilih Kitab</option>
                                        {[
                                            ...new Set(
                                                dataKitabDurus.map((k) => k.kitab)
                                            ),
                                        ].map((kitab) => (
                                            <option key={kitab} value={kitab}>
                                                {kitab}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.kitab}
                                    />
                                </div>

                                {/* Bab */}
                                <div>
                                    <InputLabel htmlFor="bab" value="Bab" />
                                    <select
                                        id="bab"
                                        name="bab"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        value={data.bab}
                                        onChange={(e) =>
                                            setData("bab", e.target.value)
                                        }
                                        disabled={!data.kitab}
                                        required
                                    >
                                        <option value="">Pilih Bab</option>
                                        {filteredBab.map((b) => (
                                            <option key={b.bab} value={b.bab}>
                                                {b.bab}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.bab}
                                    />
                                </div>

                                <div className="flex justify-end mt-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </form>
                            {showSuccessToast && (
                                <ToastSuccess message="Data akademik berhasil ditambahkan!" />
                            )}
                            {showErrorToast && (
                                <ToastError message="Terjadi kesalahan. Silakan periksa kembali." />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
