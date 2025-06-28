import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    ArrowLeftIcon,
    CalendarDaysIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';
import { 
    ArrowPathIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        nama_kelas: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tahun-santri.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Tahun santri baru berhasil ditambahkan',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white'
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link 
                        href={route('tahun-santri.index')} 
                        className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Tahun Santri Baru</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Buat tahun/tingkat baru untuk pengelolaan santri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Tahun Santri Baru" />
            
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 mr-4">
                                    <CalendarDaysIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Formulir Tahun Santri</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Isi data berikut untuk menambahkan tahun/tingkat baru
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="nama_kelas" value="Nama Tahun/Tingkat" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <TextInput
                                            id="nama_kelas"
                                            value={data.nama_kelas}
                                            onChange={e => setData('nama_kelas', e.target.value)}
                                            className="block w-full pl-4 pr-12 py-3 border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            autoFocus
                                            placeholder="Pilih 1 - 6"
                                        />
                                    </div>
                                    <InputError message={errors.nama_kelas} className="mt-2" />
                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex">
                                            <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                            <p className="ml-2 text-sm text-blue-700 dark:text-blue-300">
                                                Tahun hanya sampai 6, jika data tahun sudah 6 maka tidak perlu lagi menambahkan tahun.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Pastikan data yang dimasukkan sudah benar
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {recentlySuccessful && (
                                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                                                <span>Berhasil ditambahkan!</span>
                                            </div>
                                        )}
                                        <PrimaryButton 
                                            disabled={processing}
                                            className="min-w-[120px] justify-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                'Simpan Data'
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}