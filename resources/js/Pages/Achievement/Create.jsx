// resources/js/Pages/Achievement/Create.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput"; // Pastikan TextInput diimpor di sini
import { useEffect, useState } from "react";
import ToastSuccess from "@/Components/ToastSuccess";
import ToastError from "@/Components/ToastError";

export default function AchievementCreate({ auth, santri, santris }) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            year: "",
            santri_id: santri ? santri.id : "",
            title: "",
            type: "Hafalan", // Default value set to "memorization"
            description: "",
            date: "", // Add date field
        });

    const [uniqueYears, setUniqueYears] = useState([]); // Tahun unik dari NIS
    const [filteredSantris, setFilteredSantris] = useState([]); // Santri yang difilter berdasarkan tahun
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

    const submit = (e) => {
        e.preventDefault();

        post(route("achievements.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessToast(true);
                setTimeout(() => {
                    setShowSuccessToast(false);
                }, 3000);
            },
            onError: () => {
                setShowErrorToast(true);
                setTimeout(() => {
                    setShowErrorToast(false);
                }, 3000);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Pencapaian" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex gap-8">
                    <div className="w-full">
                        <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">
                            <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                                <h2 className="text-2xl font-bold mb-4">
                                    Tambah Pencapaian
                                </h2>
                                <p className="mb-8 text-gray-600 dark:text-gray-400">
                                    Tambahkan pencapaian baru untuk santri.
                                </p>

                                <form onSubmit={submit} className="space-y-6">
                                    {/* Input Tahun */}
                                    <div>
                                        <InputLabel
                                            htmlFor="year"
                                            value="Tahun"
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
                                            <option value="">
                                                Pilih Tahun
                                            </option>
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
                                                setData(
                                                    "santri_id",
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                !data.year || santri
                                                    ? true
                                                    : false
                                            }
                                            required
                                        >
                                            <option value="">
                                                Pilih Santri
                                            </option>
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

                                    {/* Judul Pencapaian */}
                                    <div>
                                        <InputLabel
                                            htmlFor="title"
                                            value="Judul Pencapaian"
                                        />
                                        <TextInput
                                            id="title"
                                            name="title"
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            required
                                            autoComplete="title"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.title}
                                        />
                                    </div>

                                    {/* Jenis */}
                                    <div>
                                        <InputLabel
                                            htmlFor="type"
                                            value="Jenis"
                                        />
                                        <select
                                            id="type"
                                            name="type"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            required
                                        >
                                            <option value="Hafalan">
                                                Hafalan
                                            </option>
                                            <option value="Akademik">
                                                Akademik
                                            </option>
                                        </select>
                                        <InputError
                                            className="mt-2"
                                            message={errors.type}
                                        />
                                    </div>

                                    {/* Deskripsi */}
                                    <div>
                                        <InputLabel
                                            htmlFor="description"
                                            value="Deskripsi"
                                        />
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            autoComplete="description"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.description}
                                        />
                                    </div>

                                    {/* Tanggal */}
                                    <div>
                                        <InputLabel
                                            htmlFor="date"
                                            value="Tanggal"
                                        />
                                        <TextInput
                                            id="date"
                                            name="date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                            required
                                            autoComplete="date"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.date}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 mt-8">
                                        <PrimaryButton disabled={processing}>
                                            Save
                                        </PrimaryButton>
                                    </div>
                                </form>
                                {showSuccessToast && (
                                    <ToastSuccess message="Pencapaian berhasil ditambahkan!" />
                                )}
                                {showErrorToast && (
                                    <ToastError message="Terjadi kesalahan. Silakan periksa kembali." />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
