import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar({ menu }) {
    const [isHovered, setIsHovered] = useState(false);
    const sidebarRef = useRef(null);
    const { url } = usePage();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                closeSidebar();
            }
        };

        const closeSidebar = () => {
            document
                .getElementById("drawer-navigation")
                .classList.add("-translate-x-full");
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="text-center">
                <button
                    className="mt-3 mr-5 rounded-md text-teal-700 dark:text-gray-400 font-bold p-2 dark:hover:text-gray-100 transition-colors duration-200"
                    type="button"
                    onClick={() =>
                        document
                            .getElementById("drawer-navigation")
                            .classList.toggle("-translate-x-full")
                    }
                    aria-label="Open navigation"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-list"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                        />
                    </svg>
                </button>
            </div>

            <div
                id="drawer-navigation"
                ref={sidebarRef}
                className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800 shadow-2xl"
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                <h5
                    id="drawer-navigation-label"
                    className="text-base mb-8 mt-5 font-semibold text-teal-700 dark:text-teal-400 uppercase"
                >
                    Menu
                </h5>
                <button
                    type="button"
                    onClick={() =>
                        document
                            .getElementById("drawer-navigation")
                            .classList.add("-translate-x-full")
                    }
                    className="text-teal-700 dark:text-teal-400 mt-5 bg-transparent rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 mr-5 inline-flex items-center transition-colors duration-200"
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
                            className="bi bi-layout-sidebar-inset-reverse"
                            viewBox="0 0 16 16"
                        >
                            <path d="M2 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                            <path d="M13 4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-layout-sidebar-inset"
                            viewBox="0 0 16 16"
                        >
                            <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
                            <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                        </svg>
                    )}
                    <span className="sr-only">Close menu</span>
                </button>

                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {menu.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={route(item.href)}
                                    className={`flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-teal-700 hover:text-white dark:hover:bg-teal-400 dark:hover:text-gray-800 transition-colors duration-200 ${
                                        route().current(item.current)
                                            ? "bg-teal-700 text-white dark:bg-teal-400 dark:text-gray-800 shadow-lg"
                                            : ""
                                    }`}
                                >
                                    <span className="ms-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}