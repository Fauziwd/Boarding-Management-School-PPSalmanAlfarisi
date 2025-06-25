import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Management({ auth, activeYear }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Rapor</h2>}>
            <Head title="Manajemen Rapor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold">Generate Rapor</h3>
                            {activeYear ? (
                                <>
                                    <p className="mt-2">
                                        Semester yang sedang aktif: <strong>{activeYear.year} - {activeYear.semester}</strong>.
                                    </p>
                                    <p className="mb-4">Klik tombol di bawah untuk membuat draf rapor untuk semua santri di semester ini.</p>
                                    <Link href={route('report-cards.generate')} method="post" as="button" className="btn btn-primary">
                                        Generate Rapor Sekarang
                                    </Link>
                                </>
                            ) : (
                                <p className="text-red-500">
                                    Tidak ada tahun ajaran yang aktif. Silakan aktifkan satu di halaman 'Tahun Ajaran'.
                                </p>
                            )}

                             <div className="mt-6">
                                <Link href={route('report-cards.index')} className="link link-hover">
                                    Lihat Semua Rapor yang Sudah Dibuat &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}