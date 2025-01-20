import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <div className="bg-white shadow-lg rounded-lg flex overflow-hidden w-full max-w-4xl">
                    {/* Left Side - Illustration */}
                    <div className="hidden md:block w-1/2">
                        <img
                            src="login.png"
                            alt="Login Illustration"
                            draggable="false"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Masuk ke Akun Anda
                        </h2>

                        {status && (
                            <div className="mb-4 text-sm text-emerald-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
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

                            {/* Password Field */}
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

                            {/* Reset Password Link */}
                            {canResetPassword && (
                                <div className="text-right">
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-violet-600 hover:underline"
                                    >
                                        Lupa Password?
                                    </Link>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                                disabled={processing}
                            >
                                Masuk
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-violet-600"
                                >
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}