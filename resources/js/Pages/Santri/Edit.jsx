import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
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
            <Head title="Edit Santri" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
                            <h2 className="text-2xl font-bold mb-4">Edit Data Santri</h2>
                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nis" value="NIS" />
                                        <TextInput
                                            id="nis"
                                            name="nis"
                                            className="mt-1 block w-full"
                                            value={data.nis}
                                            onChange={(e) => setData("nis", e.target.value)}
                                            required
                                            autoComplete="nis"
                                        />
                                        <InputError message={errors.nis} className="mt-2" />
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
                                        <InputError message={errors.nama} className="mt-2" />
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
                                        <InputError message={errors.tahun_lulus} className="mt-2" />
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
                                        <InputError message={errors.tempat_lahir} className="mt-2" />
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
                                        <InputError message={errors.tanggal_lahir} className="mt-2" />
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
                                        <InputError message={errors.anak_ke} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status_yatim_piatu" value="Status Yatim Piatu" />
                                        <select
                                            id="status_yatim_piatu"
                                            name="status_yatim_piatu"
                                            value={data.status_yatim_piatu}
                                            onChange={(e) => setData("status_yatim_piatu", e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                            required
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="Ya">Ya</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                        <InputError message={errors.status_yatim_piatu} className="mt-2" />
                                    </div>

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
                                        <InputError message={errors.nama_bapak} className="mt-2" />
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
                                        <InputError message={errors.pekerjaan_bapak} className="mt-2" />
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
                                        <InputError message={errors.no_telpon_bapak} className="mt-2" />
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
                                        <InputError message={errors.nama_ibu} className="mt-2" />
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
                                        <InputError message={errors.pekerjaan_ibu} className="mt-2" />
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
                                        <InputError message={errors.no_telpon_ibu} className="mt-2" />
                                    </div>

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
                                        <InputError message={errors.alamat} className="mt-2" />
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
                                        <InputError message={errors.kelurahan} className="mt-2" />
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
                                        <InputError message={errors.kecamatan} className="mt-2" />
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
                                        <InputError message={errors.kabupaten_kota} className="mt-2" />
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
                                        <InputError message={errors.provinsi} className="mt-2" />
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
                                        <InputError message={errors.kode_pos} className="mt-2" />
                                    </div>

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
                                                file:bg-teal-50 file:text-teal-700
                                                hover:file:bg-teal-100"
                                            onChange={handleFileChange}
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
                                        <InputError message={errors.foto} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-8">
                                    <PrimaryButton disabled={processing}>Update</PrimaryButton>
                                    <Link href="/santris" className="ml-3 text-gray-600 dark:text-gray-400">
                                        Kembali
                                    </Link>
                                </div>
                            </form>
                            {showSuccessToast && (
                                <ToastSuccess message="Santri updated successfully!" />
                            )}
                            {showErrorToast && (
                                <ToastError message="Please check our message for errors." />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;