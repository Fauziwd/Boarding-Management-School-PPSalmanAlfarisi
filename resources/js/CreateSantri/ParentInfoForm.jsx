import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function ParentInfoForm({ data, setData, errors }) {
    return (
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
    );
}