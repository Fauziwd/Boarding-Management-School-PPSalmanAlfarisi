import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Profile Settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage your account information and security
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Profile Information Card */}
                    <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-2xl">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-start">
                                <div className="mr-4 hidden sm:block">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-gray-700 dark:text-teal-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Profile Information
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Update your account's profile information and email address.
                                    </p>
                                    <div className="mt-6">
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            className="max-w-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Update Card */}
                    <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-2xl">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-start">
                                <div className="mr-4 hidden sm:block">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Update Password
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Ensure your account is using a long, random password to stay secure.
                                    </p>
                                    <div className="mt-6">
                                        <UpdatePasswordForm className="max-w-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete Account Card */}
                    <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-2xl">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-start">
                                <div className="mr-4 hidden sm:block">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-gray-700 dark:text-red-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Delete Account
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Permanently delete your account and all of its data.
                                    </p>
                                    <div className="mt-6">
                                        <DeleteUserForm className="max-w-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}