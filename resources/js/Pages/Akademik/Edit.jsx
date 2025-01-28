import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import kutubs from "@/data/kutubs.json"; // Import JSON data

export default function Edit({ auth, akademik, santris }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Akademik", href: route("akademik.index") },
        { label: "Edit" },
    ];

    const { data, setData, patch, errors, processing } = useForm({
        santri_id: akademik.santri_id || "",
        kitab: akademik.kitab || "",
        bab: akademik.bab || "",
    });

    const [filteredBab, setFilteredBab] = useState([]); 

    // Filter bab berdasarkan kitab yang dipilih
    useEffect(() => {
        if (data.kitab) {
            const filtered = kutubs.filter((k) => k.kitab === data.kitab);
            setFilteredBab(filtered);
        } else {
            setFilteredBab([]);
        }
    }, [data.kitab]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Konversi nilai bab menjadi integer sebelum mengirim form
        patch(route('akademik.update', akademik.id), {
            ...data,
            bab: parseInt(data.bab, 10),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Akademik" />
            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-7">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <InputLabel htmlFor="santri_id" value="Santri" />
                                    <select
                                        id="santri_id"
                                        name="santri_id"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.santri_id}
                                        onChange={(e) => setData("santri_id", e.target.value)}
                                    >
                                        {santris.map((santri) => (
                                            <option key={santri.id} value={santri.id}>
                                                {santri.nama}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.santri_id} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="kitab" value="Kitab" />
                                    <select
                                        id="kitab"
                                        name="kitab"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.kitab}
                                        onChange={(e) => setData("kitab", e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Kitab</option>
                                        {[...new Set(kutubs.map((k) => k.kitab))].map((kitab) => (
                                            <option key={kitab} value={kitab}>
                                                {kitab}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.kitab} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="bab" value="Bab" />
                                    <select
                                        id="bab"
                                        name="bab"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.bab}
                                        onChange={(e) => setData("bab", e.target.value)}
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
                                    <InputError className="mt-2" message={errors.bab} />
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