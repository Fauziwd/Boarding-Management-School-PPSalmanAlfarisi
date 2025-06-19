import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, Link } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Selectbox from "@/Components/Selectbox";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import roles from "@/data/roles.json";

export default function UserEdit({ user, auth }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
            password_confirmation: "",
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("users.update", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                alert("User updated!");
            },
            onError: (errors) => {
                alert("Check our notification for errors.");
            },
        });
    };

     return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit User" />

            <div className="py-7">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-xl dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                        <div className="p-8 text-gray-900 dark:text-gray-100">
                            <section className="max-w-2xl mx-auto">
                                <header className="mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                Edit User Profile
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                Update the user account information below
                                            </p>
                                        </div>
                                        <Link 
                                            href="/users" 
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            ← Previous Page
                                        </Link>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-300 font-medium text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </header>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="name" value="Full Name" />
                                            <TextInput
                                                id="name"
                                                className="mt-2 block w-full"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="name"
                                            />
                                            <InputError className="mt-1" message={errors.name} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="email" value="Email Address" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-2 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                required
                                                autoComplete="username"
                                            />
                                            <InputError className="mt-1" message={errors.email} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="role" value="User Role" />
                                            <Selectbox
                                                value={data.role}
                                                onChange={(e) => setData("role", e.target.value)}
                                                options={roles}
                                                className="mt-2"
                                            />
                                            <InputError className="mt-1" message={errors.role} />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <InputLabel htmlFor="password" value="Password" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Leave blank to keep current</span>
                                            </div>
                                            <TextInput
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                type="password"
                                                className="mt-2 block w-full"
                                                autoComplete="new-password"
                                            />
                                            <InputError message={errors.password} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel 
                                                htmlFor="password_confirmation" 
                                                value="Confirm Password" 
                                            />
                                            <TextInput
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                                type="password"
                                                className="mt-2 block w-full"
                                                autoComplete="new-password"
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <PrimaryButton disabled={processing} className="px-6 py-3">
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </PrimaryButton>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out duration-300"
                                                enterFrom="opacity-0 translate-x-2"
                                                enterTo="opacity-100 translate-x-0"
                                                leave="transition ease-in-out duration-300"
                                                leaveFrom="opacity-100 translate-x-0"
                                                leaveTo="opacity-0 translate-x-2"
                                            >
                                                <p className="ml-4 text-sm font-medium text-green-600 dark:text-green-400">
                                                    Changes saved successfully!
                                                </p>
                                            </Transition>
                                        </div>
                                        <Link 
                                             href="/users" 
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </Link>
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