import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";

export default function PersonalInfoForm({ 
    data, 
    setData, 
    errors, 
    handleFileChange, 
    filePreview,
    // PERBAIKAN: Prop 'kelas' tidak lagi dibutuhkan di sini
}) {
    // State lokal untuk mengelola status pengecekan NIS
    const [nisStatus, setNisStatus] = useState({ 
        loading: false, 
        exists: null, 
        message: '' 
    });

    // Fungsi untuk menangani perubahan pada input NIS, mempertahankan format Anda
    const handleNISChange = (e) => {
        let value = e.target.value.replace(/[^\d.]/g, ""); // Izinkan angka dan titik
        // Logika pemformatan Anda dipertahankan
        if (value.length > 4 && value[4] !== '.') value = value.slice(0, 4) + "." + value.slice(4);
        if (value.length > 7 && value[7] !== '.') value = value.slice(0, 7) + "." + value.slice(7);
        // Batasi panjang maksimal
        if (value.length > 11) value = value.slice(0, 11);
        
        setData('nis', value);
    };

    // Pengecekan ketersediaan NIS secara real-time ke server
    useEffect(() => {
        // Cek hanya jika NIS sudah diisi lengkap (11 karakter termasuk titik)
        if (data.nis && data.nis.length === 11) {
            
            setNisStatus({ 
                loading: true, 
                exists: null, 
                message: 'Mengecek NIS...' 
            });
            
            const nisForCheck = data.nis.replace(/\./g, '');

            const debouncedCheck = debounce(() => {
                axios.get(route('api.santri.checkNis', { nis: nisForCheck }))
                    .then(response => {
                        setNisStatus({
                            loading: false,
                            exists: response.data.exists,
                            message: response.data.exists ? 'NIS sudah digunakan' : 'NIS tersedia'
                        });
                    })
                    .catch(error => {
                        console.error("Gagal mengecek NIS:", error);
                        setNisStatus({ 
                            loading: false, 
                            exists: null, 
                            message: 'Gagal mengecek NIS.' 
                        });
                    });
            }, 500);

            debouncedCheck();

            return () => debouncedCheck.cancel();
        } else {
            setNisStatus({ loading: false, exists: null, message: '' });
        }
    }, [data.nis]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NIS */}
            <div>
                <InputLabel htmlFor="nis" value="Nomor Induk Santri (NIS)" />
                <TextInput
                    id="nis"
                    name="nis"
                    className="mt-1 block w-full"
                    value={data.nis}
                    onChange={handleNISChange}
                    required
                    autoComplete="nis"
                    placeholder="Contoh: 1445.01.001"
                />
                {nisStatus.message && (
                    <p className={`text-sm mt-1 ${
                        nisStatus.exists === true ? 'text-red-500' : 
                        nisStatus.exists === false ? 'text-green-500' : 
                        'text-gray-500'
                    }`}>
                        {nisStatus.loading && (
                            <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full mr-2" 
                                role="status" 
                                aria-hidden="true">
                            </span>
                        )}
                        {nisStatus.message}
                    </p>
                )}
                <InputError className="mt-2" message={errors.nis} />
            </div>
            
            {/* NISN */}
            <div>
                <InputLabel htmlFor="nisn" value="NISN (Opsional)" />
                <TextInput
                    id="nisn"
                    name="nisn"
                    className="mt-1 block w-full"
                    value={data.nisn}
                    onChange={(e) => setData('nisn', e.target.value)}
                    autoComplete="nisn"
                />
                <InputError className="mt-2" message={errors.nisn} />
            </div>

            {/* Nama Santri */}
            <div className="sm:col-span-2">
                <InputLabel htmlFor="nama_santri" value="Nama Lengkap Santri" />
                <TextInput
                    id="nama_santri"
                    name="nama_santri"
                    value={data.nama_santri}
                    onChange={(e) => setData('nama_santri', e.target.value)}
                    className="mt-1 block w-full"
                    required
                    isFocused={true}
                />
                <InputError message={errors.nama_santri} className="mt-2" />
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div>
                <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                <TextInput
                    id="tempat_lahir"
                    name="tempat_lahir"
                    className="mt-1 block w-full"
                    value={data.tempat_lahir}
                    onChange={(e) => setData("tempat_lahir", e.target.value)}
                    required
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
                />
                <InputError className="mt-2" message={errors.tanggal_lahir} />
            </div>
            
            {/* Jenis Kelamin */}
            <div>
                 <InputLabel htmlFor="jenis_kelamin" value="Jenis Kelamin" />
                 <select
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    value={data.jenis_kelamin}
                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                    required
                >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                <InputError message={errors.jenis_kelamin} className="mt-2" />
            </div>

            {/* PERBAIKAN: Dropdown Kelas dihapus dari sini */}

            {/* Agama */}
            <div>
                <InputLabel htmlFor="agama" value="Agama" />
                <select
                    id="agama"
                    name="agama"
                    value={data.agama}
                    onChange={(e) => setData('agama', e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                    required
                >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Kristen Katolik">Kristen Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                </select>
                <InputError message={errors.agama} className="mt-2" />
            </div>
            
            {/* Anak Ke & Status Yatim Piatu */}
            <div>
                <InputLabel htmlFor="anak_ke" value="Anak Ke" />
                <TextInput
                    id="anak_ke"
                    name="anak_ke"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.anak_ke}
                    onChange={(e) => setData("anak_ke", e.target.value)}
                    required
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
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                    required
                >
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                </select>
                <InputError message={errors.status_yatim_piatu} className="mt-2" />
            </div>
            
             {/* Foto Santri */}
            <div className="sm:col-span-2">
                <InputLabel htmlFor="foto" value="Foto (Opsional)" />
                <input
                    id="foto"
                    name="foto"
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-gray-700 file:text-teal-700 dark:file:text-gray-300 hover:file:bg-teal-100"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                {filePreview && (
                    <div className="mt-4">
                        <img
                            src={filePreview}
                            alt="Preview"
                            draggable="false"
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    </div>
                )}
                <InputError className="mt-2" message={errors.foto} />
            </div>
        </div>
    );
}
