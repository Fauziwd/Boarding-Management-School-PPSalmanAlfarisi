import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    ArrowLeftIcon, 
    UserPlusIcon, 
    InformationCircleIcon,
    AcademicCapIcon,
    PhoneIcon,
    MapPinIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';
import { 
    ChevronDownIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth, users = [] }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        user_id: '',
        roles: [],
        phone_number: '',
        address: '',
    });

    const teacherRoleOptions = [
        { value: 'Murobbi', description: 'Guru pembina karakter dan spiritual' },
        { value: 'Muhafidz', description: 'Guru penghafal Al-Quran' },
        { value: 'Mudaris', description: 'Guru pengajar ilmu pengetahuan' }
    ];

    const handleRoleChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setData('roles', [...data.roles, value]);
        } else {
            setData('roles', data.roles.filter((role) => role !== value));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teachers.store'), {
            onSuccess: () => {
                // Reset form except roles for better UX
                setData({
                    ...data,
                    user_id: '',
                    phone_number: '',
                    address: ''
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Guru Baru" />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center">
                            <Link 
                                href={route('teachers.index')} 
                                className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Guru Baru</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Lengkapi form berikut untuk menambahkan guru baru
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informational Card */}
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5"/>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Informasi Penting
                                </h3>
                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    <p>
                                        Pastikan akun guru sudah terdaftar di sistem. Jika belum, silahkan buat terlebih dahulu di halaman{' '}
                                        <Link 
                                            href={route('users.create')} 
                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            User Management
                                        </Link>.
                                    </p>
                                    {users.length === 0 && (
                                        <div className="mt-3 flex items-center text-sm text-red-600 dark:text-red-400">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
                                            <span>Tidak ada user tersedia untuk dijadikan guru</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 sm:p-8 space-y-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* User Selection */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <InputLabel htmlFor="user_id" value="Pilih Akun User" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {users.length} akun tersedia
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            id="user_id" 
                                            name="user_id" 
                                            value={data.user_id}
                                            onChange={(e) => setData('user_id', e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            disabled={users.length === 0}
                                        >
                                            <option value="">Pilih Guru Tersedia</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} 
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                    <InputError message={errors.user_id} className="mt-1" />
                                </div>

                                {/* Roles Selection */}
                                <div className="space-y-4">
                                    <InputLabel value="Peran Guru" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        Pilih satu atau lebih peran yang akan diemban oleh guru ini
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {teacherRoleOptions.map((role) => (
                                            <div 
                                                key={role.value} 
                                                className={`p-4 border rounded-lg transition-all ${data.roles.includes(role.value) ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'}`}
                                            >
                                                <label className="flex items-start space-x-3">
                                                    <div className="flex items-center h-5">
                                                        <Checkbox
                                                            name="roles"
                                                            value={role.value}
                                                            checked={data.roles.includes(role.value)}
                                                            onChange={handleRoleChange}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {role.value}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {role.description}
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} className="mt-1" />
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-6">
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
                                            Informasi Tambahan
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Data berikut bersifat opsional namun akan membantu kelengkapan profil guru
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="phone_number" value="Nomor Telepon" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput 
                                                    id="phone_number" 
                                                    type="tel" 
                                                    value={data.phone_number} 
                                                    onChange={(e) => setData('phone_number', e.target.value)} 
                                                    className="block w-full pl-10" 
                                                    placeholder="0812-3456-7890"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="address" value="Alamat" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea 
                                                    id="address" 
                                                    value={data.address} 
                                                    onChange={(e) => setData('address', e.target.value)} 
                                                    className="block w-full pl-10 h-[120px] border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                                    placeholder="Jl. Pendidikan No. 123..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Pastikan semua data sudah benar sebelum disimpan
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {recentlySuccessful && (
                                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                                                <span>Guru berhasil ditambahkan!</span>
                                            </div>
                                        )}
                                        <PrimaryButton 
                                            disabled={processing || users.length === 0 || data.user_id === ''}
                                            className="min-w-[150px] justify-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlusIcon className="w-5 h-5 mr-2" />
                                                    Simpan Guru
                                                </>
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