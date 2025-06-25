import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import dataKitabDurus from "@/data/dataKitabDurus.json";
import {
    FiArrowLeft,
    FiUser,
    FiBook,
    FiBookOpen,
    FiSave,
} from "react-icons/fi";

export default function Edit({ auth, akademik, santris }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Akademik", href: route("akademik.index") },
        { label: "Edit Pencapaian" },
    ];

    const { data, setData, patch, errors, processing } = useForm({
        santri_id: akademik.santri_id || "",
        kitab: akademik.kitab || "",
        bab: akademik.bab || "",
    });

    const [filteredBab, setFilteredBab] = useState([]);

    useEffect(() => {
        if (data.kitab) {
            const filtered = dataKitabDurus.filter(
                (k) => k.kitab === data.kitab
            );
            setFilteredBab(filtered);
        } else {
            setFilteredBab([]);
        }
    }, [data.kitab]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("akademik.update", akademik.id), {
            ...data,
            bab: parseInt(data.bab, 10),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Akademik" />
            <div className="py-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="p-6 flex justify-between items-start">
                        <div>
                            <Link
                                href={route("akademik.index")}
                                className="flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 mb-4 transition-colors"
                            >
                                <FiArrowLeft className="mr-2" />
                                Kembali
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <FiBookOpen className="mr-3 text-teal-500" />
                                Edit Pencapaian Akademik
                            </h1>
                            <Breadcrumbs items={breadcrumbs} className="mt-2" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FiUser className="text-teal-500 mr-2" />
                                        <InputLabel
                                            htmlFor="santri_id"
                                            value="Nama Santri"
                                            className="text-gray-700 dark:text-gray-300 font-medium"
                                        />
                                    </div>
                                    <select
                                        id="santri_id"
                                        name="santri_id"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-teal-500 dark:focus:border-teal-500 py-3 px-4 border transition duration-150 ease-in-out"
                                        value={data.santri_id}
                                        onChange={(e) =>
                                            setData("santri_id", e.target.value)
                                        }
                                    >
                                        {santris.map((santri) => (
                                            <option
                                                key={santri.id}
                                                value={santri.id}
                                                className="py-2"
                                            >
                                                {santri.nama_santri}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-1"
                                        message={errors.santri_id}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FiBook className="text-teal-500 mr-2" />
                                        <InputLabel
                                            htmlFor="kitab"
                                            value="Kitab"
                                            className="text-gray-700 dark:text-gray-300 font-medium"
                                        />
                                    </div>
                                    <select
                                        id="kitab"
                                        name="kitab"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-teal-500 dark:focus:border-teal-500 py-3 px-4 border transition duration-150 ease-in-out"
                                        value={data.kitab}
                                        onChange={(e) =>
                                            setData("kitab", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Pilih Kitab</option>
                                        {[
                                            ...new Set(
                                                dataKitabDurus.map(
                                                    (k) => k.kitab
                                                )
                                            ),
                                        ].map((kitab) => (
                                            <option
                                                key={kitab}
                                                value={kitab}
                                                className="py-2"
                                            >
                                                {kitab}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-1"
                                        message={errors.kitab}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FiBookOpen className="text-teal-500 mr-2" />
                                        <InputLabel
                                            htmlFor="bab"
                                            value="Bab"
                                            className="text-gray-700 dark:text-gray-300 font-medium"
                                        />
                                    </div>
                                    <select
                                        id="bab"
                                        name="bab"
                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-teal-500 dark:focus:border-teal-500 py-3 px-4 border transition duration-150 ease-in-out ${
                                            !data.kitab
                                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                : ""
                                        }`}
                                        value={data.bab}
                                        onChange={(e) =>
                                            setData("bab", e.target.value)
                                        }
                                        disabled={!data.kitab}
                                        required
                                    >
                                        <option value="">
                                            {data.kitab
                                                ? "Pilih Bab"
                                                : "Pilih kitab terlebih dahulu"}
                                        </option>
                                        {filteredBab.map((b) => (
                                            <option
                                                key={b.bab}
                                                value={b.bab}
                                                className="py-2"
                                            >
                                                {b.bab}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-1"
                                        message={errors.bab}
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Link
                                        href={route("akademik.index")}
                                        className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 border border-transparent rounded-lg shadow-sm text-white font-medium hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                                        disabled={processing}
                                    >
                                        <FiSave className="mr-2" />
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
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
