import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";

export default function Edit({ auth }) {
    const { achievement, santris = [] } = usePage().props;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            santri_id: achievement.santri_id || "",
            type: achievement.type || "",
            title: achievement.title || "",
            description: achievement.description || "",
            date: achievement.date || "", // Pastikan field date ada di form
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("achievements.update", achievement.id), {
            preserveScroll: true,
            onSuccess: () => {
                alert("Pencapaian berhasil diperbarui!");
            },
            onError: (errors) => {
                console.log(errors); // Log error to console for debugging
                alert(
                    "Terjadi kesalahan, periksa notifikasi untuk detail lebih lanjut."
                );
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Pencapaian" />

            <div className="py-7">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-7 text-gray-900 dark:text-gray-100">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Edit Pencapaian
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Perbarui informasi pencapaian di sini!
                                    </p>
                                </header>

                                <form
                                    onSubmit={submit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <InputLabel
                                            htmlFor="santri_id"
                                            value="Nama Santri"
                                        />
                                        <select
                                            id="santri_id"
                                            value={data.santri_id}
                                            onChange={(e) =>
                                                setData(
                                                    "santri_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">
                                                Pilih Santri
                                            </option>
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
                                            message={errors.santri_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="type"
                                            value="Tipe"
                                        />
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="Hafalan">
                                                Hafalan
                                            </option>
                                            <option value="Akademik">
                                                Akademik
                                            </option>
                                        </select>
                                        <InputError
                                            message={errors.type}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="title"
                                            value="Judul"
                                        />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="mt-1 block w-full"
                                        />
                                        <InputError
                                            message={errors.title}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="description"
                                            value="Deskripsi"
                                        />
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                        ></textarea>
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="date"
                                            value="Tanggal"
                                        />
                                        <TextInput
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                            className="mt-1 block w-full"
                                        />
                                        <InputError
                                            message={errors.date}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            Simpan
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Tersimpan.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
