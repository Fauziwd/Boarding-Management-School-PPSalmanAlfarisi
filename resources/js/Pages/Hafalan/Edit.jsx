import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Edit({ auth, hafalan, santris }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Hafalan", href: route("hafalan.index") },
        { label: "Edit" },
    ];

    const { data, setData, patch, errors, processing } = useForm({
        santri_id: hafalan.santri_id || "",
        surah: hafalan.surah || "",
        ayat: hafalan.ayat || "",
        juz: hafalan.juz || "",
        month: hafalan.month || "", // Pastikan data 'month' ada
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", data); // Debug log
        patch(route("hafalan.update", hafalan.id));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Hafalan" />
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
                                    >
                                        {santris.map((santri) => (
                                            <option
                                                key={santri.id}
                                                value={santri.id}
                                            >
                                                {santri.nama_santri}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.santri_id}
                                    />
                                </div>

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
