import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function AddressInfoForm({ data, setData, errors }) {
    return (
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
                <InputLabel htmlFor="kabupaten" value="Kabupaten/Kota" />
                <TextInput
                    id="kabupaten"
                    name="kabupaten"
                    className="mt-1 block w-full"
                    value={data.kabupaten}
                    onChange={(e) => setData("kabupaten", e.target.value)}
                    required
                    autoComplete="kabupaten"
                />
                <InputError className="mt-2" message={errors.kabupaten} />
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
    );
}
