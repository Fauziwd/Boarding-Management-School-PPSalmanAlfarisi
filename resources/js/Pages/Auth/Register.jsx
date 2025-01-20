import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';


export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex p-4 items-center justify-center bg-gray-200">
                <div className="bg-white shadow-lg rounded-lg flex overflow-hidden w-auto max-w-4xl">
                    {/* Left Side - Illustration */}
                    <div className="hidden md:block w-1/2">
                        <img
                            src="register.png"
                            alt="Register Illustration"
                            draggable="false"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Buat Akun Baru
                        </h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-700 focus:border-emerald-700"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-700 focus:border-emerald-700"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-700 focus:border-emerald-700"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Konfirmasi Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-700 focus:border-emerald-700"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                                disabled={processing}
                            >
                                Daftar
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-violet-500"
                                >
                                    Masuk sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}