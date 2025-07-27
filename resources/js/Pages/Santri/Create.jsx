import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import ToastSuccess from "@/Components/ToastSuccess";
import ToastError from "@/Components/ToastError";
import PersonalInfoForm from "@/CreateSantri/PersonalInfoForm";
import ParentInfoForm from "@/CreateSantri/ParentInfoForm";
import AddressInfoForm from "@/CreateSantri/AddressInfoForm"; // Pastikan path ini benar
import { FiArrowLeft, FiCheck, FiFileText, FiHome, FiUsers, FiUpload, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

// Fungsi format NIS bisa tetap di sini atau dipindah ke file terpisah
const formatNIS = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4) + "." + value.slice(4);
    if (value.length > 7) value = value.slice(0, 7) + "." + value.slice(7);
    if (value.length > 11) value = value.slice(0, 11);
    return value;
};



// Fix ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Komponen kecil untuk menangani event klik pada peta
function LocationMarker({ onPositionChange }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onPositionChange(e.latlng); // Kirim koordinat ke form utama
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const steps = [
    {
        id: "pribadi",
        title: "Informasi Pribadi",
        icon: <FiUser className="w-5 h-5" />,
        description: "Lengkapi data diri santri",
    },
    {
        id: "ortu",
        title: "Informasi Orang Tua",
        icon: <FiUsers className="w-5 h-5" />,
        description: "Data orang tua/wali santri",
    },
    {
        id: "alamat",
        title: "Informasi Alamat",
        icon: <FiHome className="w-5 h-5" />,
        description: "Alamat lengkap santri",
    },
];

export default function SantriCreate({ auth, generatedNis }) {
    const { data, setData, post, errors, processing, recentlySuccessful, reset, clearErrors } = useForm({
        nis: generatedNis || "",
        nisn: "",
        nama_santri: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        kelas_id: "",
        agama: "Islam",
        anak_ke: "",
        status_yatim_piatu: "",
        nama_bapak: "",
        pekerjaan_bapak: "",
        no_hp_bapak: "",
        nama_ibu: "",
        pekerjaan_ibu: "",
        no_hp_ibu: "",
        alamat: "",
        kelurahan: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        kode_pos: "",
        foto: null,
        // PEMBARUAN 1: Tambahkan latitude dan longitude di sini
        latitude: "",
        longitude: "",
    });

     const [currentStep, setCurrentStep] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [filePreview, setFilePreview] = useState(null);

    // Fungsi handle NIS dan file tetap sama
    const handleNISChange = (e) => setData("nis", formatNIS(e.target.value));
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("foto", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    // PEMBARUAN 2: Buat fungsi untuk menangani perubahan posisi dari peta
    const handlePositionChange = (latlng) => {
        setData((prevData) => ({
            ...prevData,
            latitude: latlng.lat.toFixed(8),
            longitude: latlng.lng.toFixed(8),
        }));
    };

   const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("santris.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 4000);
                reset();
                setFilePreview(null);
                setCurrentStep(0);
            },
            onError: () => {
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 4000);
            },
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

       // Variabel prevStep ini ditambahkan untuk animasi
    const [prevStepState, setPrevStepState] = useState(0);
    const updateStep = (newStep) => {
        setPrevStepState(currentStep);
        setCurrentStep(newStep);
    }

  return (
    <AuthenticatedLayout user={auth.user}>
        <Head title="Tambah Santri Baru" />

        <div className="bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 min-h-screen py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Premium Sidebar Stepper */}
                    <div className="w-full lg:w-1/4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 sticky top-28"
                        >
                            <Link
                                href={route("santris.index")}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 mb-6 group"
                            >
                                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Daftar
                            </Link>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                                <FiFileText className="mr-3 text-teal-500" />
                                Proses Pendaftaran
                            </h2>

                            <div className="relative">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative pb-10 last:pb-0"
                                    >
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`absolute top-5 left-5 -ml-px w-0.5 h-full ${
                                                    index < currentStep
                                                        ? "bg-teal-500"
                                                        : "bg-gray-200 dark:bg-gray-700"
                                                }`}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <div
                                            onClick={() => setCurrentStep(index)}
                                            className="relative flex items-start group cursor-pointer"
                                        >
                                            <span className="h-10 flex items-center">
                                                <span
                                                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ring-4 ring-white dark:ring-gray-800 shadow-md ${
                                                        index < currentStep
                                                            ? "bg-teal-500 text-white"
                                                            : index === currentStep
                                                            ? "bg-gradient-to-br from-teal-600 to-emerald-500 text-white border-2 border-white dark:border-gray-900 shadow-lg"
                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {index < currentStep ? (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            <FiCheck className="w-5 h-5" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div whileHover={{ rotate: 5 }}>
                                                            {step.icon}
                                                        </motion.div>
                                                    )}
                                                </span>
                                            </span>
                                            <div className="ml-4 min-w-0">
                                                <span
                                                    className={`text-xs font-semibold tracking-wide uppercase ${
                                                        index === currentStep
                                                            ? "text-teal-600 dark:text-teal-300"
                                                            : index < currentStep
                                                            ? "text-teal-500"
                                                            : "text-gray-500 dark:text-gray-400"
                                                    }`}
                                                >
                                                    Step {index + 1}
                                                </span>
                                                <span
                                                    className={`block text-base font-medium ${
                                                        index === currentStep
                                                            ? "text-gray-900 dark:text-white"
                                                            : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {step.title}
                                                </span>
                                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {step.description}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Form Content */}
                    <div className="w-full lg:w-3/4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="mb-8">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center mb-4"
                                    >
                                        <div
                                            className={`p-3 rounded-lg mr-4 ${
                                                currentStep === 0
                                                    ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300"
                                                    : currentStep === 1
                                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                                            }`}
                                        >
                                            {steps[currentStep].icon}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                                {steps[currentStep].title}
                                            </h1>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                                {steps[currentStep].description}
                                            </p>
                                        </div>
                                    </motion.div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                currentStep === 0
                                                    ? "bg-teal-500"
                                                    : currentStep === 1
                                                    ? "bg-blue-500"
                                                    : "bg-emerald-500"
                                            }`}
                                            style={{
                                                width: `${((currentStep + 1) / steps.length) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <form onSubmit={submit}>
                                    {Object.keys(errors).length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-lg mb-8"
                                        >
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    {/* ... SVG Icon Error ... */}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                                        Terdapat {Object.keys(errors).length} kesalahan
                                                    </h3>
                                                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {Object.values(errors).map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="min-h-[400px]"
                                    >
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
                                                onPositionChange={handlePositionChange}
                                            />
                                        )}
                                    </motion.div>

                                    <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                                        <div>
                                            {currentStep > 0 && (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                >
                                                    <FiArrowLeft className="mr-2" />
                                                    Kembali
                                                </motion.button>
                                            )}
                                        </div>
                                        <div>
                                            {currentStep < steps.length - 1 ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none"
                                                >
                                                    Lanjut
                                                    {/* ... SVG Icon Lanjut ... */}
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-75 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? (
                                                        <>
                                                            {/* ... SVG Icon Loading ... */}
                                                            Memproses...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUpload className="mr-2" />
                                                            Simpan Data Santri
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>

        {/* Toast Notifications */}
        <div
            aria-live="assertive"
            className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
        >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                <Transition
                    show={showSuccessToast}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ToastSuccess
                        message="Data santri berhasil disimpan!"
                        onClose={() => setShowSuccessToast(false)}
                    />
                </Transition>
                <Transition
                    show={showErrorToast}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ToastError
                        message="Gagal menyimpan. Periksa kembali isian Anda."
                        onClose={() => setShowErrorToast(false)}
                    />
                </Transition>
            </div>
        </div>
    </AuthenticatedLayout>
);
}