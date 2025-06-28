import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Selectbox from "@/Components/Selectbox";
import roles from "@/data/roles.json";
import { FaUserPlus, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function UserIndex({ auth }) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "user",
            email_verified_at: new Date().toISOString(),
            remember_token: Math.random().toString(36).substring(2, 15),
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            preserveScroll: true,
        });
    };

    const breadcrumbs = [
        { label: "Home", href: "/dashboard" },
        { label: "User Management", href: "/users" },
        { label: "Create New User" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create New User" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Breadcrumbs items={breadcrumbs} />
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaUserPlus className="mr-3 h-6 w-6 text-indigo-500" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Create New User
                                </h1>
                            </div>
                            <Link
                                href="/users"
                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <IoMdArrowRoundBack className="mr-2" />
                                Back to Users
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                        <div className="p-6 sm:p-8">
                            <section>
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        User Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Fill in the details below to create a new user account.
                                    </p>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Full Name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />
                                            <TextInput
                                                id="name"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData("name", e.target.value)
                                                }
                                                required
                                                isFocused
                                                autoComplete="name"
                                                placeholder="Mang Kipli"
                                            />
                                            <InputError
                                                className="mt-1 text-sm"
                                                message={errors.name}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="email"
                                                value="Email Address"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                required
                                                autoComplete="email"
                                                placeholder="user@example.com"
                                            />
                                            <InputError
                                                className="mt-1 text-sm"
                                                message={errors.email}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Password"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />
                                            <TextInput
                                                id="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                type="password"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                            />
                                            <InputError
                                                message={errors.password}
                                                className="mt-1 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirm Password"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />
                                            <TextInput
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) =>
                                                    setData("password_confirmation", e.target.value)
                                                }
                                                type="password"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                                className="mt-1 text-sm"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="role"
                                                value="User Role"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            />
                                            <Selectbox
                                                onChange={(e) =>
                                                    setData("role", e.target.value)
                                                }
                                                currentValue={data.role}
                                                id="role"
                                                options={roles}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                            <InputError
                                                className="mt-1 text-sm"
                                                message={errors.role}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pt-4">
                                        <Link
                                            href="/users"
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton
                                            disabled={processing}
                                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                        >
                                            {processing ? 'Creating...' : 'Create User'}
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-300 transform"
                                            enterFrom="translate-x-4 opacity-0"
                                            enterTo="translate-x-0 opacity-100"
                                            leave="transition ease-in-out duration-300 transform"
                                            leaveFrom="translate-x-0 opacity-100"
                                            leaveTo="translate-x-4 opacity-0"
                                        >
                                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                <FaCheckCircle className="mr-1.5 h-4 w-4" />
                                                User created successfully!
                                            </div>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}