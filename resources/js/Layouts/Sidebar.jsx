import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FaCalendarAlt, FaBookReader } from 'react-icons/fa'; // Import ikon

export default function Sidebar({ menu }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isAcademicOpen, setIsAcademicOpen] = useState(false);
    const sidebarRef = useRef(null);
    const { url, props } = usePage();
    const { auth } = props; // Ambil data auth dari props

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        const closeSidebar = () => {
            document.getElementById("drawer-navigation").classList.add("-translate-x-full");
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        document.getElementById("drawer-navigation").classList.toggle("-translate-x-full");
        setIsOpen(!isOpen);
    };

    // Group menu items by category
    const groupedMenu = menu.reduce((acc, item) => {
        if (item.name === "Akademik" || item.name === "Hafalan") {
            if (!acc['Pendidikan']) {
                acc['Pendidikan'] = [];
            }
            acc['Pendidikan'].push(item);
        } else {
            acc[item.name] = [item];
        }
        return acc;
    }, {});

    return (
        <div>
            {/* Hamburger Button */}
            <div className="text-center scroll-smooth scrollbar-none scroll-hidden">
                <button
                    className="mt-3 mr-5 rounded-lg text-teal-700 dark:text-gray-300 font-bold p-2 dark:hover:text-gray-100 transition-all duration-300 dark:hover:bg-gray-700"
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Open navigation"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-list transition-transform duration-300 hover:scale-110"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div
                id="drawer-navigation"
                ref={sidebarRef}
                className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform duration-300 ease-in-out -translate-x-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700"
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8 mt-5 px-2">
                    <h5
                        id="drawer-navigation-label"
                        className="text-lg font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider"
                    >
                        Menu
                    </h5>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="text-teal-600 dark:text-teal-400 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center transition-all duration-300 dark:hover:bg-gray-700"
                        aria-label="Close navigation"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-x-lg transition-transform duration-300 hover:rotate-90"
                                viewBox="0 0 16 16"
                            >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-x-lg transition-transform duration-300 hover:rotate-90"
                                viewBox="0 0 16 16"
                            >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        )}
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                {/* Menu Items */}
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        
                        {/* ======================= AWAL PERUBAHAN ======================= */}

                        {/* MENU KHUSUS ADMIN */}
                        {auth.user.role === 'admin' && (
                            <>
                                <li>
                                    <h4 className="px-3 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">Administrasi</h4>
                                </li>
                                <li>
                                    <Link
                                        href={route('academic-years.index')}
                                        className={`flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 ${
                                            route().current('academic-years.index')
                                                ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg"
                                                : "hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white"
                                        }`}
                                    >
                                        <FaCalendarAlt className="w-5 h-5 mr-3" />
                                        <span className="font-medium">Tahun Ajaran</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
    href={route('report_cards.index')}
    className={`flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 ${
        route().current('report_cards.index')
            ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg"
            : "hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white"
    }`}
>
    <FaBookReader className="w-5 h-5 mr-3" />
    <span className="font-medium">Manajemen Rapor</span>
</Link>
                                </li>
                                <li>
                                    <h4 className="px-3 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">Menu Utama</h4>
                                </li>
                            </>
                        )}

                        {/* ======================= AKHIR PERUBAHAN ======================= */}


                        {Object.entries(groupedMenu).map(([category, items]) => (
                            <li key={category}>
                                {category === 'Pendidikan' ? (
                                    <>
                                        <button
                                            onClick={() => setIsAcademicOpen(!isAcademicOpen)}
                                            className="flex items-center justify-between w-full p-3 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            <span className="font-medium">Pendidikan</span>
                                            {isAcademicOpen ? (
                                                <ChevronUpIcon className="h-5 w-5" />
                                            ) : (
                                                <ChevronDownIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                        {isAcademicOpen && (
                                            <ul className="ml-4 mt-2 space-y-2">
                                                {items.map((item, index) => (
                                                    <li key={index}>
                                                        <Link
                                                            href={route(item.href)}
                                                            className={`flex items-center p-2 pl-4 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 ${
                                                                route().current(item.current)
                                                                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg"
                                                                    : "hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white"
                                                            }`}
                                                        >
                                                            <span className="font-medium">{item.name}</span>
                                                            {route().current(item.current) && (
                                                                <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={route(items[0].href)}
                                        className={`flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 ${
                                            route().current(items[0].current)
                                                ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg"
                                                : "hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white"
                                        }`}
                                    >
                                        <span className="font-medium">{items[0].name}</span>
                                        {route().current(items[0].current) && (
                                            <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sidebar Footer */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Sistem Manajemen Sekolah
                    </div>
                </div> */}
            </div>

            {/* Overlay when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}