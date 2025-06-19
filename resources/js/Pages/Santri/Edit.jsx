import React, { useState, useEffect } from "react";
import {Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import ToastSuccess from "@/Components/ToastSuccess";
import ToastError from "@/Components/ToastError";

const Edit = ({ auth, santri }) => {
    const { data, setData, patch, processing, errors } = useForm({
        nis: santri.nis || "",
        nama: santri.nama || "",
        tahun_lulus: santri.tahun_lulus || "",
        tempat_lahir: santri.tempat_lahir || "",
        tanggal_lahir: santri.tanggal_lahir || "",
        anak_ke: santri.anak_ke || "",
        status_yatim_piatu: santri.status_yatim_piatu || "",
        nama_bapak: santri.nama_bapak || "",
        pekerjaan_bapak: santri.pekerjaan_bapak || "",
        no_telpon_bapak: santri.no_telpon_bapak || "",
        nama_ibu: santri.nama_ibu || "",
        pekerjaan_ibu: santri.pekerjaan_ibu || "",
        no_telpon_ibu: santri.no_telpon_ibu || "",
        alamat: santri.alamat || "",
        kelurahan: santri.kelurahan || "",
        kecamatan: santri.kecamatan || "",
        kabupaten_kota: santri.kabupaten_kota || "",
        provinsi: santri.provinsi || "",
        kode_pos: santri.kode_pos || "",
        foto: null,
    });

    const [filePreview, setFilePreview] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        if (santri.foto) {
            setFilePreview(`/storage/${santri.foto}`);
        }
    }, [santri.foto]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("foto", file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('santris.update', santri.id), {
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
            <Head title="Edit Data Murid" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xl sm:rounded-2xl dark:bg-gray-800">
                        <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    Edit Data Murid
                                </h2>
                                <div className="mt-4 sm:mt-0">
                                    <Link 
                                        href="/santris" 
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Kembali ke Daftar Murid
                                    </Link>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex space-x-4">
                                    {[
                                        { id: 'personal', label: 'Data Pribadi' },
                                        { id: 'parents', label: 'Data Orang Tua' },
                                        { id: 'address', label: 'Alamat' },
                                        { id: 'photo', label: 'Foto' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                {/* Personal Data Tab */}
                                {activeTab === 'personal' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="nis" value="NIS" />
                                            <TextInput
                                                id="nis"
                                                name="nis"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.nis}
                                                onChange={(e) => setData("nis", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nis} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="nama" value="Nama Lengkap" />
                                            <TextInput
                                                id="nama"
                                                name="nama"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.nama}
                                                onChange={(e) => setData("nama", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nama} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tahun_lulus" value="Tahun Lulus" />
                                            <TextInput
                                                id="tahun_lulus"
                                                name="tahun_lulus"
                                                type="number"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.tahun_lulus}
                                                onChange={(e) => setData("tahun_lulus", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.tahun_lulus} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                                            <TextInput
                                                id="tempat_lahir"
                                                name="tempat_lahir"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData("tempat_lahir", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.tempat_lahir} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />
                                            <TextInput
                                                id="tanggal_lahir"
                                                name="tanggal_lahir"
                                                type="date"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData("tanggal_lahir", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.tanggal_lahir} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="anak_ke" value="Anak Ke" />
                                            <TextInput
                                                id="anak_ke"
                                                name="anak_ke"
                                                type="number"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.anak_ke}
                                                onChange={(e) => setData("anak_ke", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.anak_ke} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="status_yatim_piatu" value="Status Yatim/Piatu" />
                                            <select
                                                id="status_yatim_piatu"
                                                name="status_yatim_piatu"
                                                value={data.status_yatim_piatu}
                                                onChange={(e) => setData("status_yatim_piatu", e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                                                required
                                            >
                                                <option value="">Pilih Status</option>
                                                <option value="Ya">Ya</option>
                                                <option value="Tidak">Tidak</option>
                                            </select>
                                            <InputError message={errors.status_yatim_piatu} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                {/* Parents Data Tab */}
                                {activeTab === 'parents' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">Data Ayah</h3>
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="nama_bapak" value="Nama Ayah" />
                                            <TextInput
                                                id="nama_bapak"
                                                name="nama_bapak"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.nama_bapak}
                                                onChange={(e) => setData("nama_bapak", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nama_bapak} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="pekerjaan_bapak" value="Pekerjaan Ayah" />
                                            <TextInput
                                                id="pekerjaan_bapak"
                                                name="pekerjaan_bapak"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.pekerjaan_bapak}
                                                onChange={(e) => setData("pekerjaan_bapak", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.pekerjaan_bapak} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="no_telpon_bapak" value="No. HP Ayah" />
                                            <TextInput
                                                id="no_telpon_bapak"
                                                name="no_telpon_bapak"
                                                type="tel"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.no_telpon_bapak}
                                                onChange={(e) => setData("no_telpon_bapak", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.no_telpon_bapak} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-2 mt-6">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">Data Ibu</h3>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="nama_ibu" value="Nama Ibu" />
                                            <TextInput
                                                id="nama_ibu"
                                                name="nama_ibu"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.nama_ibu}
                                                onChange={(e) => setData("nama_ibu", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nama_ibu} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="pekerjaan_ibu" value="Pekerjaan Ibu" />
                                            <TextInput
                                                id="pekerjaan_ibu"
                                                name="pekerjaan_ibu"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.pekerjaan_ibu}
                                                onChange={(e) => setData("pekerjaan_ibu", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.pekerjaan_ibu} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="no_telpon_ibu" value="No. HP Ibu" />
                                            <TextInput
                                                id="no_telpon_ibu"
                                                name="no_telpon_ibu"
                                                type="tel"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.no_telpon_ibu}
                                                onChange={(e) => setData("no_telpon_ibu", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.no_telpon_ibu} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                {/* Address Data Tab */}
                                {activeTab === 'address' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <InputLabel htmlFor="alamat" value="Alamat Lengkap" />
                                            <textarea
                                                id="alamat"
                                                name="alamat"
                                                rows="3"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                                                value={data.alamat}
                                                onChange={(e) => setData("alamat", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.alamat} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="kelurahan" value="Kelurahan" />
                                            <TextInput
                                                id="kelurahan"
                                                name="kelurahan"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.kelurahan}
                                                onChange={(e) => setData("kelurahan", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.kelurahan} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="kecamatan" value="Kecamatan" />
                                            <TextInput
                                                id="kecamatan"
                                                name="kecamatan"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.kecamatan}
                                                onChange={(e) => setData("kecamatan", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.kecamatan} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="kabupaten_kota" value="Kabupaten/Kota" />
                                            <TextInput
                                                id="kabupaten_kota"
                                                name="kabupaten_kota"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.kabupaten_kota}
                                                onChange={(e) => setData("kabupaten_kota", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.kabupaten_kota} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="provinsi" value="Provinsi" />
                                            <TextInput
                                                id="provinsi"
                                                name="provinsi"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.provinsi}
                                                onChange={(e) => setData("provinsi", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.provinsi} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="kode_pos" value="Kode Pos" />
                                            <TextInput
                                                id="kode_pos"
                                                name="kode_pos"
                                                type="number"
                                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700"
                                                value={data.kode_pos}
                                                onChange={(e) => setData("kode_pos", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.kode_pos} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                {/* Photo Tab */}
                                {activeTab === 'photo' && (
                                    <div className="flex flex-col items-center">
                                        <div className="w-full max-w-md">
                                            <InputLabel htmlFor="foto" value="Foto Santri" />
                                            <div className="mt-1 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6">
                                                {filePreview ? (
                                                    <img
                                                        src={filePreview}
                                                        alt="Preview Foto Santri"
                                                        className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-teal-200 dark:border-teal-800"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label
                                                        htmlFor="foto"
                                                        className="relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 focus-within:outline-none"
                                                    >
                                                        <span>Upload foto</span>
                                                        <input
                                                            id="foto"
                                                            name="foto"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">atau drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    PNG, JPG, JPEG maksimal 2MB
                                                </p>
                                            </div>
                                            <InputError message={errors.foto} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end mt-8">
                                    <PrimaryButton 
                                        disabled={processing}
                                        className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            {showSuccessToast && (
                <ToastSuccess message="Data Murid berhasil diperbarui!" />
            )}
            {showErrorToast && (
                <ToastError message="Gagal memperbarui data. Silakan periksa kembali form." />
            )}
        </AuthenticatedLayout>
    );
};

export default Edit;