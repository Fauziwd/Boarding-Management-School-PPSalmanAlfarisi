import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-emerald-50 min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full bg-emerald-500 text-white shadow">
                    <div className="container mx-auto flex justify-between items-center px-6 py-4">
                        <h1 className="text-2xl font-bold">Sistem Manajemen Sekolah</h1>
                        <nav className="flex space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-white text-emerald-500 rounded-full shadow hover:bg-emerald-100 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 bg-white text-emerald-500 rounded-full shadow hover:bg-emerald-100 transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-white text-emerald-500 rounded-full shadow hover:bg-emerald-100 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-white py-20 flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Selamat Datang di Sistem Manajemen Sekolah
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Solusi modern untuk mengelola aktivitas sekolah Anda dengan mudah dan efisien.
                        </p>
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="mt-6 px-8 py-4 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition text-lg"
                        >
                            {auth.user ? 'Mulai Sekarang' : 'Coba Sekarang'}
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full bg-emerald-500 text-white py-4">
    <div className="container mx-auto text-left">
        <p className="text-sm ml-3">
            &copy; 2025 Web Management System. All rights reserved.
        </p>
        <p className="text-sm ml-3">
            Developed by{' '}
            <a
                href="https://fauziresume.vercel.app/"
                className="text-white font-semibold"
                target="_blank"
                rel="noopener noreferrer"
            >
                Zee Dev
            </a>
        </p>
    </div>
</footer>
            </div>
        </>
    );
}