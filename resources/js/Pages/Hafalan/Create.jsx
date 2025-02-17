import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Create({ auth, santris }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan", href: route("hafalan.index") },
        { label: "Tambah" },
    ];

    const { data, setData, post, errors, processing } = useForm({
        santri_id: "",
        juz: "",
        month: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("hafalan.store"));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Tambah Hafalan" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <InputLabel
                                        htmlFor="year"
                                        value="Tahun Ajaran"
                                        className="mb-3"
                                    />
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
                                        className="mb-2 mt-4"
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
                                {/* Hafalan Juz */}
                                <div>
                                    <InputLabel
                                        htmlFor="juz"
                                        value="Juz"
                                        className="mb-2 mt-4"
                                    />
                                    <TextInput
                                        id="juz"
                                        name="juz"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.juz}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,2}$/.test(value)) {
                                                setData("juz", value);
                                            }
                                        }}
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.juz}
                                    />
                                </div>

                                {/* Bulan */}

                                <div>
                                    <InputLabel
                                        htmlFor="month"
                                        value="Tanggal"
                                    />
                                    <TextInput
                                        id="month"
                                        name="month"
                                        type="month"
                                        className="mt-1 block w-full"
                                        value={data.month}
                                        onChange={(e) =>
                                            setData("month", e.target.value)
                                        }
                                        required
                                        autoComplete="month"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.month}
                                    />
                                </div>

                                <div className="flex justify-end mt-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan
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
