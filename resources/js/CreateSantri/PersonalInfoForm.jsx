import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PersonalInfoForm({ data, setData, errors, handleNISChange, handleFileChange, filePreview }) {
    const [nisExists, setNisExists] = useState(false);

    useEffect(() => {
        if (data.nis.length >= 4) {
            axios.get(`/api/check-nis/${data.nis}`)
                .then((response) => {
                    setNisExists(response.data.exists);
                })
                .catch((error) => {
                    console.error("There was an error checking the NIS!", error);
                });
        } else {
            setNisExists(false);
        }
    }, [data.nis]);

    return (
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
                {nisExists && (
                    <p className="text-red-500 text-sm mt-1">NIS sudah ada.</p>
                )}
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    required
                >
                    <option value="">Pilih Status</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                </select>
                <InputError className="mt-2" message={errors.status_yatim_piatu} />
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
    );
}