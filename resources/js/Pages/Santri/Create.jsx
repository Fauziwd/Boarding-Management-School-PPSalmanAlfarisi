import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import ToastSuccess from "@/Components/ToastSuccess"; 
import ToastError from "@/Components/ToastError";

const formatNIS = (value) => {
    value = value.replace(/\D/g, '');

    if (value.length > 4) {
        value = value.slice(0, 4) + '.' + value.slice(4);
    }
    if (value.length > 7) {
        value = value.slice(0, 7) + '.' + value.slice(7);
    }
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    return value;
};

const steps = [
    "Informasi Pribadi",
    "Informasi Orang Tua",
    "Informasi Alamat",
];

export default function SantriCreate({ auth }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        nis: "",
        nama: "",
        tahun_lulus: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        anak_ke: "",
        status_yatim_piatu: "",
        nama_bapak: "",
        pekerjaan_bapak: "",
        no_telpon_bapak: "",
        nama_ibu: "",
        pekerjaan_ibu: "",
        no_telpon_ibu: "",
        alamat: "",
        kelurahan: "",
        kecamatan: "",
        kabupaten_kota: "",
        provinsi: "",
        kode_pos: "",
        foto: null,  // Tambahkan state untuk foto
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [filePreview, setFilePreview] = useState(null);

    const handleNISChange = (e) => {
        const formattedNIS = formatNIS(e.target.value);
        setData("nis", formattedNIS);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("foto", file);  // Set file foto

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("santris.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessToast(true);
                setTimeout(() => {
                    setShowSuccessToast(false);
                }, 3000); // Toast akan hilang setelah 3 detik
            },
            onError: () => {
                setShowErrorToast(true);
                setTimeout(() => {
                    setShowErrorToast(false);
                }, 3000); // Toast akan hilang setelah 3 detik
            },
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Santri" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex gap-8">
                    <aside className="w-1/4">
                        <div className="bg-white border border-indigo-800 dark:bg-gray-800 shadow-xl sm:rounded-lg p-8">
                            <h2 className="text-xl dark:text-white font-bold mb-6 text-center">Data Santri</h2>
                            <ol className="relative border-l ml-6 border-gray-200 dark:border-gray-700">
                                {steps.map((step, index) => (
                                    <li key={index} className="mb-10 ml-6">
                                        <span
                                            className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 ${
                                                index < currentStep
                                                    ? 'border border-emerald-500 dark:border-emerald-300 bg-green-200 dark:bg-green-600'
                                                    : index === currentStep
                                                    ? 'border border-indigo-600 dark:border-indigo-400 bg-indigo-500 text-white dark:bg-indigo-700'
                                                    : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                        >
                                            {index < currentStep ? (
                                                <svg
                                                    className="w-3.5 h-3.5 text-green-500 dark:text-green-200"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 16 12"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M1 5.917 5.724 10.5 15 1.5"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-3.5 h-3.5 text-white dark:text-gray-200"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a 2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Z" />
                                                </svg>
                                            )}
                                        </span>
                                        <h3
                                            className={`font-bold ml-2 leading-tight ${
                                                index === currentStep ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                        >
                                            {step}
                                        </h3>
                                        <p className="text-sm ml-2 dark:text-gray-400 font-light italic">
                                            {index === currentStep ? 'Lengkapi Data' : ''}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>

                    <div className="w-3/4">
                        <div className="bg-white dark:bg-gray-800 border border-indigo-800 shadow-xl sm:rounded-lg">
                            <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                                <h2 className="text-2xl font-bold mb-4">Create Santri</h2>
                                <p className="mb-8 text-gray-600 dark:text-gray-400">
                                    Create a new santri here by filling the form.
                                </p>

                                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                    {/* Alert section for displaying general form errors */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                            <strong className="font-bold">There were some errors with your submission:</strong>
                                            <ul className="mt-2 list-disc list-inside">
                                                {Object.keys(errors).map((key) => (
                                                    <li key={key}>{errors[key]}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {currentStep === 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="nis" value="NIS" />
                                                <TextInput
                                                    id="nis"
                                                    name="nis"
                                                    className="mt-1 block w-full"
                                                    value={data.nis}
                                                    onChange={handleNISChange}
                                                    required
                                                    autoComplete="nis"
                                                />
                                                <InputError className="mt-2" message={errors.nis} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="nama" value="Nama" />
                                                <TextInput
                                                    id="nama"
                                                    name="nama"
                                                    className="mt-1 block w-full"
                                                    value={data.nama}
                                                    onChange={(e) => setData("nama", e.target.value)}
                                                    required
                                                    autoComplete="nama"
                                                />
                                                <InputError className="mt-2" message={errors.nama} />
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
                                                    autoComplete="tahun_lulus"
                                                />
                                                <InputError className="mt-2" message={errors.tahun_lulus} />
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
                                                    autoComplete="tempat_lahir"
                                                />
                                                <InputError className="mt-2" message={errors.tempat_lahir} />
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
                                                    autoComplete="tanggal_lahir"
                                                />
                                                <InputError className="mt-2" message={errors.tanggal_lahir} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="anak_ke" value="Anak Ke" />
                                                <TextInput
                                                    id="anak_ke"
                                                    name="anak_ke"
                                                    className="mt-1 block w-full"
                                                    value={data.anak_ke}
                                                    onChange={(e) => setData("anak_ke", e.target.value)}
                                                    required
                                                    autoComplete="anak_ke"
                                                />
                                                <InputError className="mt-2" message={errors.anak_ke} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="status_yatim_piatu" value="Status Yatim Piatu" />
                                                <select
                                                    id="status_yatim_piatu"
                                                    name="status_yatim_piatu"
                                                    value={data.status_yatim_piatu}
                                                    onChange={(e) => setData("status_yatim_piatu", e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                >
                                                    <option value="">Pilih Status</option>
                                                    <option value="Ya">Ya</option>
                                                    <option value="Tidak">Tidak</option>
                                                </select>
                                                <InputError className="mt-2" message={errors.status_yatim_piatu} />
                                            </div>

                                            {/* Input untuk Foto */}
                                            <div>
                                                <InputLabel htmlFor="foto" value="Foto" />
                                                <input
                                                    id="foto"
                                                    name="foto"
                                                    type="file"
                                                    className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-indigo-50 file:text-indigo-700
                                                        hover:file:bg-indigo-100"
                                                    onChange={handleFileChange}
                                                    required
                                                    accept="image/*"
                                                />
                                                {filePreview && (
                                                    <div className="mt-4">
                                                        <img
                                                            src={filePreview}
                                                            alt="Preview"
                                                            draggable="false"
                                                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                                                        />
                                                    </div>
                                                )}
                                                <InputError className="mt-2" message={errors.foto} />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="nama_bapak" value="Nama Bapak" />
                                                <TextInput
                                                    id="nama_bapak"
                                                    name="nama_bapak"
                                                    className="mt-1 block w-full"
                                                    value={data.nama_bapak}
                                                    onChange={(e) => setData("nama_bapak", e.target.value)}
                                                    required
                                                    autoComplete="nama_bapak"
                                                />
                                                <InputError className="mt-2" message={errors.nama_bapak} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="pekerjaan_bapak" value="Pekerjaan Bapak" />
                                                <TextInput
                                                    id="pekerjaan_bapak"
                                                    name="pekerjaan_bapak"
                                                    className="mt-1 block w-full"
                                                    value={data.pekerjaan_bapak}
                                                    onChange={(e) => setData("pekerjaan_bapak", e.target.value)}
                                                    required
                                                    autoComplete="pekerjaan_bapak"
                                                />
                                                <InputError className="mt-2" message={errors.pekerjaan_bapak} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="no_telpon_bapak" value="No HP Bapak" />
                                                <TextInput
                                                    id="no_telpon_bapak"
                                                    name="no_telpon_bapak"
                                                    className="mt-1 block w-full"
                                                    value={data.no_telpon_bapak}
                                                    onChange={(e) => setData("no_telpon_bapak", e.target.value)}
                                                    required
                                                    autoComplete="no_telpon_bapak"
                                                />
                                                <InputError className="mt-2" message={errors.no_telpon_bapak} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="nama_ibu" value="Nama Ibu" />
                                                <TextInput
                                                    id="nama_ibu"
                                                    name="nama_ibu"
                                                    className="mt-1 block w-full"
                                                    value={data.nama_ibu}
                                                    onChange={(e) => setData("nama_ibu", e.target.value)}
                                                    required
                                                    autoComplete="nama_ibu"
                                                />
                                                <InputError className="mt-2" message={errors.nama_ibu} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="pekerjaan_ibu" value="Pekerjaan Ibu" />
                                                <TextInput
                                                    id="pekerjaan_ibu"
                                                    name="pekerjaan_ibu"
                                                    className="mt-1 block w-full"
                                                    value={data.pekerjaan_ibu}
                                                    onChange={(e) => setData("pekerjaan_ibu", e.target.value)}
                                                    required
                                                    autoComplete="pekerjaan_ibu"
                                                />
                                                <InputError className="mt-2" message={errors.pekerjaan_ibu} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="no_telpon_ibu" value="No HP Ibu" />
                                                <TextInput
                                                    id="no_telpon_ibu"
                                                    name="no_telpon_ibu"
                                                    className="mt-1 block w-full"
                                                    value={data.no_telpon_ibu}
                                                    onChange={(e) => setData("no_telpon_ibu", e.target.value)}
                                                    required
                                                    autoComplete="no_telpon_ibu"
                                                />
                                                <InputError className="mt-2" message={errors.no_telpon_ibu} />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="alamat" value="Alamat" />
                                                <TextInput
                                                    id="alamat"
                                                    name="alamat"
                                                    className="mt-1 block w-full"
                                                    value={data.alamat}
                                                    onChange={(e) => setData("alamat", e.target.value)}
                                                    required
                                                    autoComplete="alamat"
                                                />
                                                <InputError className="mt-2" message={errors.alamat} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kelurahan" value="Kelurahan" />
                                                <TextInput
                                                    id="kelurahan"
                                                    name="kelurahan"
                                                    className="mt-1 block w-full"
                                                    value={data.kelurahan}
                                                    onChange={(e) => setData("kelurahan", e.target.value)}
                                                    required
                                                    autoComplete="kelurahan"
                                                />
                                                <InputError className="mt-2" message={errors.kelurahan} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kecamatan" value="Kecamatan" />
                                                <TextInput
                                                    id="kecamatan"
                                                    name="kecamatan"
                                                    className="mt-1 block w-full"
                                                    value={data.kecamatan}
                                                    onChange={(e) => setData("kecamatan", e.target.value)}
                                                    required
                                                    autoComplete="kecamatan"
                                                />
                                                <InputError className="mt-2" message={errors.kecamatan} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kabupaten_kota" value="Kabupaten/Kota" />
                                                <TextInput
                                                    id="kabupaten_kota"
                                                    name="kabupaten_kota"
                                                    className="mt-1 block w-full"
                                                    value={data.kabupaten_kota}
                                                    onChange={(e) => setData("kabupaten_kota", e.target.value)}
                                                    required
                                                    autoComplete="kabupaten_kota"
                                                />
                                                <InputError className="mt-2" message={errors.kabupaten_kota} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="provinsi" value="Provinsi" />
                                                <TextInput
                                                    id="provinsi"
                                                    name="provinsi"
                                                    className="mt-1 block w-full"
                                                    value={data.provinsi}
                                                    onChange={(e) => setData("provinsi", e.target.value)}
                                                    required
                                                    autoComplete="provinsi"
                                                />
                                                <InputError className="mt-2" message={errors.provinsi} />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kode_pos" value="Kode Pos" />
                                                <TextInput
                                                    id="kode_pos"
                                                    name="kode_pos"
                                                    className="mt-1 block w-full"
                                                    value={data.kode_pos}
                                                    onChange={(e) => setData("kode_pos", e.target.value)}
                                                    required
                                                    autoComplete="kode_pos"
                                                />
                                                <InputError className="mt-2" message={errors.kode_pos} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-8">
                                        {currentStep > 0 && (
                                            <PrimaryButton type="button" onClick={prevStep}>
                                                Previous
                                            </PrimaryButton>
                                        )}

                                        {currentStep < steps.length - 1 ? (
                                            <PrimaryButton type="button" onClick={nextStep}>
                                            Next
                                        </PrimaryButton>
                                    ) : (
                                        <PrimaryButton disabled={processing}>
                                            Save
                                        </PrimaryButton>
                                    )}
                                </div>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Saved.
                                    </p>
                                </Transition>
                                </form>
                                {showSuccessToast && <ToastSuccess message="Santri created successfully!" />}
                                {showErrorToast && <ToastError message="Please check our message for errors." />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>  
    );
}