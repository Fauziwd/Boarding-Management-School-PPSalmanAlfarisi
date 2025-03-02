import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import ToastSuccess from "@/Components/ToastSuccess";
import ToastError from "@/Components/ToastError";
import PersonalInfoForm from "@/CreateSantri/PersonalInfoForm";
import ParentInfoForm from "@/CreateSantri/ParentInfoForm";
import AddressInfoForm from "@/CreateSantri/AddressInfoForm";

const formatNIS = (value) => {
    value = value.replace(/\D/g, "");

    if (value.length > 4) {
        value = value.slice(0, 4) + "." + value.slice(4);
    }
    if (value.length > 7) {
        value = value.slice(0, 7) + "." + value.slice(7);
    }
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    return value;
};

const steps = ["Informasi Pribadi", "Informasi Orang Tua", "Informasi Alamat"];

export default function SantriCreate({ auth }) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
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
            foto: null, // Tambahkan state untuk foto
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
        setData("foto", file); // Set file foto

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
                        <div className="bg-white border border-teal-800 dark:bg-gray-800 shadow-xl sm:rounded-lg p-8">
                            <h2 className="text-xl dark:text-white font-bold mb-6 text-center">
                                Data Santri
                            </h2>
                            <ol className="relative border-l ml-6 border-gray-200 dark:border-gray-700">
                                {steps.map((step, index) => (
                                    <li key={index} className="mb-10 ml-6">
                                        <span
                                            className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 ${
                                                index < currentStep
                                                    ? "border border-emerald-500 dark:border-emerald-300 bg-green-200 dark:bg-green-600"
                                                    : index === currentStep
                                                    ? "border border-teal-600 dark:border-teal-400 bg-teal-500 text-white dark:bg-teal-700"
                                                    : "bg-gray-100 dark:bg-gray-700"
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
                                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0-2Z" />
                                                </svg>
                                            )}
                                        </span>
                                        <h3
                                            className={`font-bold ml-2 leading-tight ${
                                                index === currentStep
                                                    ? "text-gray-800 dark:text-white"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {step}
                                        </h3>
                                        <p className="text-sm ml-2 dark:text-gray-400 font-light italic">
                                            {index === currentStep
                                                ? "Lengkapi Data"
                                                : ""}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>

                    <div className="w-3/4">
                        <div className="bg-white dark:bg-gray-800 border border-teal-800 shadow-xl sm:rounded-lg">
                            <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                                <h2 className="text-2xl font-bold mb-4">
                                    Create Santri
                                </h2>
                                <p className="mb-8 text-gray-600 dark:text-gray-400">
                                    Create a new santri here by filling the
                                    form.
                                </p>

                                <form
                                    onSubmit={submit}
                                    className="space-y-6"
                                    encType="multipart/form-data"
                                >
                                    {/* Alert section for displaying general form errors */}
                                    {Object.keys(errors).length > 0 && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                            role="alert"
                                        >
                                            <strong className="font-bold">
                                                There were some errors with your
                                                submission:
                                            </strong>
                                            <ul className="mt-2 list-disc list-inside">
                                                {Object.keys(errors).map(
                                                    (key) => (
                                                        <li key={key}>
                                                            {errors[key]}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {currentStep === 0 && (
                                        <PersonalInfoForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            handleNISChange={handleNISChange}
                                            handleFileChange={handleFileChange}
                                            filePreview={filePreview}
                                        />
                                    )}

                                    {currentStep === 1 && (
                                        <ParentInfoForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    )}

                                    {currentStep === 2 && (
                                        <AddressInfoForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    )}

                                    <div className="flex items-center gap-4 mt-8">
                                        {currentStep > 0 && (
                                            <PrimaryButton
                                                type="button"
                                                onClick={prevStep}
                                            >
                                                Previous
                                            </PrimaryButton>
                                        )}

                                        {currentStep < steps.length - 1 ? (
                                            <PrimaryButton
                                                type="button"
                                                onClick={nextStep}
                                            >
                                                Next
                                            </PrimaryButton>
                                        ) : (
                                            <PrimaryButton
                                                disabled={processing}
                                            >
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
                                {showSuccessToast && (
                                    <ToastSuccess message="Santri created successfully!" />
                                )}
                                {showErrorToast && (
                                    <ToastError message="Please check our message for errors." />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}