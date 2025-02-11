import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import SubmitAttendance from '@/Components/Attendance/Submit';
import DarkModeToggle from '@/Components/DarkModeToggle'; // Sesuaikan path-nya

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
               Ahlan, {auth.user.name}
                <p className='font-light text-sm mt-1'>Anda masuk di web ini sebagai <strong>{auth.user.role}</strong></p>
            </h2>
        }
    >
            <Head title="Dashboard" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 p-4 overflow-hidden mt-3 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <section className="max-w-xl">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <SubmitAttendance />
                        </div>
                    </section>
                </div>
            </div>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 p-4">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        Data statistik bisa anda lihat disini.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}