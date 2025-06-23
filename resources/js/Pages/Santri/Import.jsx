import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";
import * as XLSX from "xlsx";
import InputError from "@/Components/InputError";
import ToastSuccess from "@/Components/ToastSuccess";

export default function Import({ auth }) {
    const [santriData, setSantriData] = useState([]); // State untuk menyimpan data hasil parse
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { errors, clearErrors } = useForm();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array", cellDates: true });
            const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Mengonversi array of arrays menjadi array of objects
            // Asumsikan baris pertama adalah header
            const headers = json[0];
            const a_o_o = json.slice(1).map(row => {
                const newRow = {};
                headers.forEach((header, index) => {
                    // Konversi tanggal jika ada
                    if(row[index] instanceof Date) {
                       // Format YYYY-MM-DD
                       newRow[header] = row[index].toISOString().split('T')[0];
                    } else {
                       newRow[header] = row[index];
                    }
                });
                return newRow;
            });

            setSantriData(a_o_o);
        };

        reader.readAsArrayBuffer(file);
    };

    const submit = (e) => {
        e.preventDefault();
        if (santriData.length === 0) {
            alert("Silakan pilih file Excel terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        clearErrors();

        router.post(route("santris.import.json"), { santris: santriData }, {
            onSuccess: () => {
                setShowSuccess(true);
                setSantriData([]); // Kosongkan preview setelah berhasil
                setFileName('');
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Import Santri" />
            {showSuccess && <ToastSuccess message="Data berhasil diimpor!" />}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h2 className="text-2xl font-bold mb-4">Import Data Santri via Excel</h2>
                             <p className="mb-6 text-gray-600 dark:text-gray-400">
                                Unggah file Excel (.xlsx, .xls). Pastikan nama kolom di baris pertama
                                file Excel Anda sama persis dengan yang ada di template.
                            </p>

                            <a href="/template/template_santri.xlsx" download className="text-teal-600 hover:underline mb-6 block font-semibold">
                                Unduh Template Excel
                            </a>

                            <div className="mb-6">
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-800 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                                    Pilih File
                                </label>
                                <input id="file-upload" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                                {fileName && <span className="ml-4">{fileName}</span>}
                            </div>

                             {/* Preview Data */}
                            {santriData.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold mb-4">Preview Data ({santriData.length} baris)</h3>
                                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    {Object.keys(santriData[0]).map(key => (
                                                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {santriData.slice(0, 10).map((row, index) => ( // Hanya tampilkan 10 baris pertama untuk preview
                                                    <tr key={index}>
                                                        {Object.values(row).map((value, i) => (
                                                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm">{value}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {santriData.length > 10 && <p className="p-4 text-sm text-center">...dan {santriData.length - 10} baris lainnya.</p>}
                                    </div>

                                    <form onSubmit={submit} className="mt-6">
                                        <InputError message={errors.santris} className="mt-2" />
                                        <PrimaryButton disabled={isLoading}>
                                            {isLoading ? "Menyimpan..." : `Simpan ${santriData.length} Data Santri`}
                                        </PrimaryButton>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}