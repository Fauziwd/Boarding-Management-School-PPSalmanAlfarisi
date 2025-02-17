import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import SubmitAttendance from "@/Components/Attendance/Submit";
import Statistik from "@/Components/Attendance/Statistik";

export default function Dashboard() {
    const { auth, attendanceStats, totalAttendances } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-teal-600 dark:text-gray-200">
                        Ahlan, {auth.user.name}
                        <p className="font-light text-sm mt-1 text-teal-700 dark:text-gray-400">
                            Posisi anda disini sebagai{" "}
                            <mark className="bg-teal-100 text-teal-700 px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-300">
                                {auth.user.role}
                            </mark>
                        </p>
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Card for Submit Attendance */}
                    <div className="mb-6 overflow-hidden bg-gradient-to-r from-teal-50/5 to-teal-100/5 shadow-lg sm:rounded-lg dark:from-gray-800 dark:to-gray-700">
                        <section className="p-6">
                            <div className="text-teal-900 dark:text-gray-100">
                                <SubmitAttendance />
                            </div>
                        </section>
                    </div>

                    {/* Card for Statistics */}
                    <Statistik />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
