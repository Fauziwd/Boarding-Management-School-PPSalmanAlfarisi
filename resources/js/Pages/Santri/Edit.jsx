import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AddressInfoForm from "@/CreateSantri/AddressInfoForm";
import Swal from "sweetalert2";
import {
    FiArrowLeft,
    FiUser,
    FiUsers,
    FiMapPin,
    FiCamera,
    FiAlertCircle,
} from "react-icons/fi";

// Komponen untuk menampilkan ringkasan error di bagian atas form
const ErrorSummary = ({ errors }) => {
    if (Object.keys(errors).length === 0) return null;
    return (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Terdapat {Object.keys(errors).length} kesalahan pada data Anda.
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>Silakan periksa semua tab dan perbaiki isian yang salah.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PERBAIKAN: Menghapus prop 'kelas' yang tidak lagi digunakan
export default function Edit({ auth, santri }) {
    // PERBAIKAN: Menghapus 'kelas_id' dari state form
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "patch",
        nis: santri.nis || "",
        nisn: santri.nisn || "",
        nama_santri: santri.nama_santri || "",
        status_santri: santri.status_santri || "Aktif",
        tempat_lahir: santri.tempat_lahir || "",
        tanggal_lahir: santri.tanggal_lahir || "",
        jenis_kelamin: santri.jenis_kelamin || "Laki-laki",
        agama: santri.agama || "Islam",
        anak_ke: santri.anak_ke || "",
        status_yatim_piatu: santri.status_yatim_piatu || "Tidak",
        nama_bapak: santri.nama_bapak || "",
        pekerjaan_bapak: santri.pekerjaan_bapak || "",
        no_hp_bapak: santri.no_hp_bapak || "",
        nama_ibu: santri.nama_ibu || "",
        pekerjaan_ibu: santri.pekerjaan_ibu || "",
        no_hp_ibu: santri.no_hp_ibu || "",
        alamat: santri.alamat || "",
        kelurahan: santri.kelurahan || "",
        kecamatan: santri.kecamatan || "",
        kabupaten: santri.kabupaten || "",
        provinsi: santri.provinsi || "",
        kode_pos: santri.kode_pos || "",
        foto: null,
          latitude: santri.latitude || "",
        longitude: santri.longitude || "",
    });

    const [filePreview, setFilePreview] = useState(santri.foto_url || null);
    const [activeTab, setActiveTab] = useState("personal");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("foto", file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

      const handlePositionChange = (latlng) => {
        setData((prevData) => ({
            ...prevData,
            latitude: latlng.lat.toFixed(8),
            longitude: latlng.lng.toFixed(8),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("santris.update", santri.id), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Data berhasil diperbarui!",
                    showConfirmButton: false,
                    timer: 3000,
                });
            },
            onError: (error) => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Gagal memperbarui data. Periksa kembali form.",
                    showConfirmButton: false,
                    timer: 3000,
                });
                console.error(error);
            },
        });
    };

    const tabs = [
        { id: "personal", label: "Data Pribadi", icon: FiUser },
        { id: "parents", label: "Data Orang Tua", icon: FiUsers },
        { id: "address", label: "Alamat", icon: FiMapPin },
        { id: "photo", label: "Foto", icon: FiCamera },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Santri - ${santri.nama_santri}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xl sm:rounded-2xl dark:bg-gray-800">
                        <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    Edit Data Santri
                                </h2>
                                <Link
                                    href={route("santris.index")}
                                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    <FiArrowLeft className="h-5 w-5 mr-2" />
                                    Kembali ke Daftar
                                </Link>
                            </div>

                            <ErrorSummary errors={errors} />

                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`whitespace-nowrap flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? "border-teal-500 text-teal-600 dark:text-teal-400"
                                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                        >
                                            <tab.icon size={16} /> {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="mt-6">
                                    {/* --- KONTEN TAB DATA PRIBADI --- */}
                                    <div
                                        className={`${
                                            activeTab === "personal"
                                                ? "block"
                                                : "hidden"
                                        }`}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                            <div>
                                                <InputLabel
                                                    htmlFor="nis"
                                                    value="NIS"
                                                    isRequired
                                                />
                                                <TextInput
                                                    id="nis"
                                                    value={data.nis}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nis",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nis}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="nisn"
                                                    value="NISN (Opsional)"
                                                />
                                                <TextInput
                                                    id="nisn"
                                                    value={data.nisn}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nisn",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nisn}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="nama_santri"
                                                    value="Nama Lengkap"
                                                    isRequired
                                                />
                                                <TextInput
                                                    id="nama_santri"
                                                    value={data.nama_santri}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_santri",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nama_santri}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="status_santri"
                                                    value="Status Santri"
                                                    isRequired
                                                />
                                                <select
                                                    id="status_santri"
                                                    value={data.status_santri}
                                                    onChange={(e) =>
                                                        setData(
                                                            "status_santri",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        data.status_santri ===
                                                        "Lulus"
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                                                >
                                                    <option value="Aktif">
                                                        Aktif
                                                    </option>
                                                    <option value="Keluar">
                                                        Keluar
                                                    </option>
                                                    {data.status_santri ===
                                                        "Lulus" && (
                                                        <option value="Lulus">
                                                            Lulus
                                                        </option>
                                                    )}
                                                </select>
                                                <InputError
                                                    message={
                                                        errors.status_santri
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="tempat_lahir"
                                                    value="Tempat Lahir"
                                                    isRequired
                                                />
                                                <TextInput
                                                    id="tempat_lahir"
                                                    value={data.tempat_lahir}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tempat_lahir",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.tempat_lahir
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="tanggal_lahir"
                                                    value="Tanggal Lahir"
                                                    isRequired
                                                />
                                                <TextInput
                                                    type="date"
                                                    id="tanggal_lahir"
                                                    value={data.tanggal_lahir}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tanggal_lahir",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.tanggal_lahir
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="jenis_kelamin"
                                                    value="Jenis Kelamin"
                                                    isRequired
                                                />
                                                <select
                                                    id="jenis_kelamin"
                                                    value={data.jenis_kelamin}
                                                    onChange={(e) =>
                                                        setData(
                                                            "jenis_kelamin",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                                                >
                                                    <option value="Laki-laki">
                                                        Laki-laki
                                                    </option>
                                                    <option value="Perempuan">
                                                        Perempuan
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={
                                                        errors.jenis_kelamin
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="anak_ke"
                                                    value="Anak Ke-"
                                                    isRequired
                                                />
                                                <TextInput
                                                    type="number"
                                                    id="anak_ke"
                                                    value={data.anak_ke}
                                                    onChange={(e) =>
                                                        setData(
                                                            "anak_ke",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.anak_ke}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="status_yatim_piatu"
                                                    value="Status Yatim/Piatu"
                                                    isRequired
                                                />
                                                <select
                                                    id="status_yatim_piatu"
                                                    value={
                                                        data.status_yatim_piatu
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "status_yatim_piatu",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                                >
                                                    <option value="Ya">
                                                        Ya
                                                    </option>
                                                    <option value="Tidak">
                                                        Tidak
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={
                                                        errors.status_yatim_piatu
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- KONTEN TAB DATA ORANG TUA --- */}
                                    <div
                                        className={`${
                                            activeTab === "parents"
                                                ? "block"
                                                : "hidden"
                                        }`}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                            <div>
                                                <InputLabel
                                                    htmlFor="nama_bapak"
                                                    value="Nama Ayah"
                                                />
                                                <TextInput
                                                    id="nama_bapak"
                                                    value={data.nama_bapak}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_bapak",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nama_bapak}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="pekerjaan_bapak"
                                                    value="Pekerjaan Ayah"
                                                />
                                                <TextInput
                                                    id="pekerjaan_bapak"
                                                    value={data.pekerjaan_bapak}
                                                    onChange={(e) =>
                                                        setData(
                                                            "pekerjaan_bapak",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.pekerjaan_bapak
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="no_hp_bapak"
                                                    value="No. HP Ayah"
                                                />
                                                <TextInput
                                                    type="tel"
                                                    id="no_hp_bapak"
                                                    value={data.no_hp_bapak}
                                                    onChange={(e) =>
                                                        setData(
                                                            "no_hp_bapak",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.no_hp_bapak}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="nama_ibu"
                                                    value="Nama Ibu"
                                                />
                                                <TextInput
                                                    id="nama_ibu"
                                                    value={data.nama_ibu}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_ibu",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.nama_ibu}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="pekerjaan_ibu"
                                                    value="Pekerjaan Ibu"
                                                />
                                                <TextInput
                                                    id="pekerjaan_ibu"
                                                    value={data.pekerjaan_ibu}
                                                    onChange={(e) =>
                                                        setData(
                                                            "pekerjaan_ibu",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.pekerjaan_ibu
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="no_hp_ibu"
                                                    value="No. HP Ibu"
                                                />
                                                <TextInput
                                                    type="tel"
                                                    id="no_hp_ibu"
                                                    value={data.no_hp_ibu}
                                                    onChange={(e) =>
                                                        setData(
                                                            "no_hp_ibu",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.no_hp_ibu}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- KONTEN TAB ALAMAT --- */}
                                    <div className={`${activeTab === "address" ? "block" : "hidden"}`}>
                                        <div className="animate-fade-in">
                                            <AddressInfoForm
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                onPositionChange={handlePositionChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* --- KONTEN TAB FOTO --- */}
                                    <div
                                        className={`${
                                            activeTab === "photo"
                                                ? "block"
                                                : "hidden"
                                        }`}
                                    >
                                        <div className="flex flex-col items-center animate-fade-in">
                                            <InputLabel
                                                htmlFor="foto"
                                                value="Ganti Foto Santri (Kosongkan jika tidak diubah)"
                                            />
                                            <div className="mt-2 flex items-center gap-8">
                                                <img
                                                    src={
                                                        // PERBAIKAN: Menggunakan ui-avatars sebagai fallback
                                                        filePreview ||
                                                        `https://ui-avatars.com/api/?name=${data.nama_santri}&background=0D9488&color=fff&size=160`
                                                    }
                                                    alt="Preview"
                                                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md"
                                                />
                                                <label
                                                    htmlFor="foto-upload"
                                                    className="cursor-pointer bg-white dark:bg-gray-700 text-teal-600 font-semibold py-2 px-4 border border-teal-500 rounded-lg shadow-sm hover:bg-teal-50 dark:hover:bg-gray-600 transition-all"
                                                >
                                                    Pilih File Baru
                                                    <input
                                                        id="foto-upload"
                                                        name="foto"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                            {progress && (
                                                <progress
                                                    value={progress.percentage}
                                                    max="100"
                                                    className="w-full mt-2"
                                                >
                                                    {progress.percentage}%
                                                </progress>
                                            )}
                                            <InputError
                                                message={errors.foto}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <PrimaryButton
                                        disabled={processing}
                                        className="px-8 py-3 text-base font-medium"
                                    >
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
