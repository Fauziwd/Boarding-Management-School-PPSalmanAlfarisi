import React, { useMemo, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Sidebar from "@/Layouts/Sidebar";
import { Link, usePage } from "@inertiajs/react";
import DarkModeToggle from "@/Components/DarkModeToggle"; // Sesuaikan path-nya

const menuItems = {
    admin: [
        { name: "Dashboard", href: "dashboard", current: "dashboard" },
        { name: "Users", href: "users", current: "users" },
        { name: "Santri", href: "santri", current: "santri" },
        { name: "Absensi", href: "absensi", current: "absensi" },
        { name: "Akademik", href: "akademik.index", current: "akademik.index" },
        { name: "Hafalan", href: "hafalan.index", current: "hafalan.index" },
    ],
    muhafidz: [
        { name: "Dashboard", href: "dashboard", current: "dashboard" },
        { name: "Hafalan", href: "hafalan.index", current: "hafalan.index" },
    ],
    default: [{ name: "Dashboard", href: "dashboard", current: "dashboard" }],
};

export default function AuthenticatedLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    // Sugesti perubahan (tidak wajib diterapkan karena Anda tidak ingin mengubah)
   const { auth } = usePage().props;
    const userName = auth?.user?.name || "Pengguna";
    const user = auth?.user || { name: "Pengguna", role: "Tidak Diketahui", email: "email@example.com" };
    const menu = useMemo(() => menuItems[user.role.toLowerCase()] || menuItems.default, [user.role]);

    const toggleNavigationDropdown = () =>
        setShowingNavigationDropdown((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b sticky top-0 z-10 border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link
                                    href="/dashboard"
                                    className="h-auto rounded-xl"
                                >
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>
                            <Sidebar menu={menu} />
                            {/* <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {menu.map((item, index) => (
                                    <NavLink key={index} href={route(item.href)} active={route().current(item.current)}>
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div> */}
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <DarkModeToggle />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                                {user.name}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={toggleNavigationDropdown}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE AREA */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {menu.map((item, index) => (
                            <ResponsiveNavLink
                                key={index}
                                href={route(item.href)}
                                active={route().current(item.href)}
                            >
                                {item.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {auth?.user?.name || userName}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {auth?.user?.email || "email@example.com"}
                            </div>
                        </div>

                        <div className="mt-1 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
