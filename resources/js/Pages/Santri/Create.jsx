import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useState, Fragment } from "react"; // [MODIFIKASI] Import Fragment
import ToastSuccess from "@/Components/ToastSuccess";
import ToastError from "@/Components/ToastError";
import PersonalInfoForm from "@/CreateSantri/PersonalInfoForm";
import ParentInfoForm from "@/CreateSantri/ParentInfoForm";
import AddressInfoForm from "@/CreateSantri/AddressInfoForm";
import { FiArrowLeft, FiCheck, FiFileText, FiHome, FiUsers, FiUpload, FiUser } from "react-icons/fi";

// Fungsi formatNIS tetap sama
const formatNIS = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4) + "." + value.slice(4);
    if (value.length > 7) value = value.slice(0, 7) + "." + value.slice(7);
    if (value.length > 11) value = value.slice(0, 11);
    return value;
};

const steps = [
    { title: "Informasi Pribadi", icon: <FiUser className="w-5 h-5" /> },
    { title: "Informasi Orang Tua", icon: <FiUsers className="w-5 h-5" /> },
    { title: "Informasi Alamat", icon: <FiHome className="w-5 h-5" /> }
];

export default function SantriCreate({ auth }) {
    const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
        nis: "",
        nama_santri: "",
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
        foto: null,
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
        setData("foto", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("santris.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
                // Opsi: reset form setelah berhasil
                // reset(); 
                // setFilePreview(null);
                // setCurrentStep(0);
            },
            onError: () => {
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 3000);
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
            <Head title="Tambah Santri Baru" />
            
            <div className="bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* [MODIFIKASI] Sidebar Navigasi dengan Garis Step-by-Step */}
                        <div className="w-full lg:w-1/4">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg rounded-2xl p-6 transition-all duration-300">
                                <div className="flex items-center mb-8">
                                    <Link href={route('santris.index')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
                                        <FiArrowLeft className="mr-2" />
                                        Kembali ke Daftar
                                    </Link>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
                                    <FiFileText className="mr-3 text-teal-500" />
                                    Proses Pendaftaran
                                </h2>
                                
                                <div className="relative">
                                    {steps.map((step, index) => (
                                        <div key={index} className="relative pb-10 last:pb-0">
                                            {/* [BARU] Garis penghubung antar step */}
                                            {index < steps.length - 1 && (
                                                <div 
                                                    className={`absolute top-5 left-5 -ml-px w-0.5 h-full ${
                                                        index < currentStep ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`} 
                                                    aria-hidden="true"
                                                />
                                            )}

                                            <div 
                                                onClick={() => setCurrentStep(index)} 
                                                className="relative flex items-start group cursor-pointer"
                                            >
                                                <span className="h-10 flex items-center">
                                                    <span className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ring-8 ring-white dark:ring-gray-800 ${
                                                        index < currentStep 
                                                            ? "bg-teal-500 text-white"
                                                            : index === currentStep
                                                            ? "bg-teal-600 text-white border-2 border-white dark:border-gray-900"
                                                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                                    }`}>
                                                        {index < currentStep ? <FiCheck className="w-5 h-5" /> : step.icon}
                                                    </span>
                                                </span>
                                                <span className="ml-4 min-w-0">
                                                    <span className={`text-sm font-semibold tracking-wide uppercase ${
                                                        index === currentStep ? "text-teal-600 dark:text-teal-300" : "text-gray-500 dark:text-gray-400"
                                                    }`}>
                                                        Step {index + 1}
                                                    </span>
                                                    <span className="block text-base font-medium text-gray-900 dark:text-white">{step.title}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filePreview && (
                                    <div className="mt-8">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pratinjau Foto</h3>
                                        <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <img src={filePreview} alt="Preview Foto Santri" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Konten Form Utama */}
                        <div className="w-full lg:w-3/4">
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg  rounded-2xl overflow-hidden transition-all duration-300">
                                <div className="p-8 sm:p-10">
                                    <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <span className="mr-4 text-teal-500">{steps[currentStep].icon}</span>
                                            {steps[currentStep].title}
                                        </h1>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            Lengkapi semua informasi pada bagian ini dengan benar.
                                        </p>
                                    </div>

                                    <form onSubmit={submit} className="space-y-8">
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-md">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Terdapat {Object.keys(errors).length} kesalahan.</h3>
                                                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {Object.keys(errors).map((key) => (<li key={key}>{errors[key]}</li>))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Konten Step */}
                                        <div className="min-h-[300px]">
                                            {currentStep === 0 && <PersonalInfoForm data={data} setData={setData} errors={errors} handleNISChange={handleNISChange} handleFileChange={handleFileChange} filePreview={filePreview} />}
                                            {currentStep === 1 && <ParentInfoForm data={data} setData={setData} errors={errors} />}
                                            {currentStep === 2 && <AddressInfoForm data={data} setData={setData} errors={errors} />}
                                        </div>

                                        {/* Navigasi Form */}
                                        <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                {currentStep > 0 && (
                                                    <button type="button" onClick={prevStep} className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-teal-500 transition-all duration-200 transform hover:scale-[1.02]">
                                                        Kembali
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                {currentStep < steps.length - 1 ? (
                                                    <button type="button" onClick={nextStep} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-teal-500 transition-all duration-200 transform hover:scale-[1.02]">
                                                        Lanjut
                                                        <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                                    </button>
                                                ) : (
                                                    <button type="submit" disabled={processing} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-teal-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed">
                                                        {processing ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Memproses...</>) : (<><FiUpload className="mr-2" />Simpan Data Santri</>)}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* [BARU] Wrapper untuk posisi Toast */}
            <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* [MODIFIKASI] Toast dengan Transisi */}
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
                        <ToastSuccess message="Data santri berhasil disimpan!" onClose={() => setShowSuccessToast(false)} />
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
                        <ToastError message="Gagal menyimpan data. Silakan periksa kembali." onClose={() => setShowErrorToast(false)} />
                    </Transition>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}