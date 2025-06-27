import React, { useState, useEffect, Fragment } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ClockIcon,
    DocumentChartBarIcon,
    CalendarDaysIcon,
    BuildingOffice2Icon,
    ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { motion, AnimatePresence } from "framer-motion";

// Helper untuk memeriksa rute aktif
const isCurrent = (href) => {
    const currentRoute = route().current();
    if (!currentRoute) return false;
    
    if (href.includes('*')) {
        const baseRoute = href.replace('.*', '');
        return currentRoute.startsWith(baseRoute);
    }
    return route().current(href);
};

const menuConfig = {
    admin: [
        { label: "Dashboard", href: "dashboard", icon: HomeIcon },
        { label: "Attendance", href: "absensi.index", icon: ClockIcon },
        {
            label: "Administration",
            icon: UserGroupIcon,
            children: [
                { label: "User Management", href: "users.index", icon: UsersIcon },
                { label: "Student Management", href: "santris.index", icon: UserGroupIcon },
                { label: "Class Management", href: "kelas.index", icon: BuildingOffice2Icon },
            ],
        },
        {
            label: "Education",
            icon: AcademicCapIcon,
            children: [
                { label: "Academic", href: "akademik.index", icon: AcademicCapIcon },
                { label: "Memorization", href: "hafalan.index", icon: BookOpenIcon },
            ],
        },
        {
            label: "Report Management",
            icon: DocumentChartBarIcon,
            children: [
                { label: "Academic Year", href: "academic-years.index", icon: CalendarDaysIcon },
                { label: "Report Data", href: "report-cards.index", icon: DocumentChartBarIcon },
            ],
        },
    ],
    muhafidz: [
        { label: "Dashboard", href: "dashboard", icon: HomeIcon },
        { label: "Memorization", href: "hafalan.index", icon: BookOpenIcon },
    ],
    default: [
        { label: "Dashboard", href: "dashboard", icon: HomeIcon },
    ],
};


const SubMenuItem = ({ item }) => {
    const active = isCurrent(item.href);
    return (
        <li>
            <Link
                href={route(item.href)}
                className={`flex items-center p-2 pl-11 text-sm rounded-lg transition-colors duration-200 group ${
                    active
                        ? "text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-900/40"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
            >
                {item.label}
            </Link>
        </li>
    );
};

const MenuItem = ({ item }) => {
    const isParentActive = item.children?.some(child => isCurrent(child.href));
    const [isOpen, setIsOpen] = useState(isParentActive);

    useEffect(() => {
        if (isParentActive) {
            setIsOpen(true);
        }
    }, [isParentActive]);

    if (!item.children) {
        const active = isCurrent(item.href);
        return (
            <li>
                <Link
                    href={route(item.href)}
                    className={`flex items-center p-3 text-base rounded-lg transition-all duration-200 group ${
                        active
                            ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium"
                    }`}
                >
                    <item.icon className={`w-6 h-6 mr-3 transition-colors ${active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-teal-600"}`} />
                    <span>{item.label}</span>
                </Link>
            </li>
        );
    }

    return (
        <li>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center w-full p-3 text-base rounded-lg transition-colors duration-200 group ${isParentActive ? "bg-gray-100 dark:bg-gray-700/50" : ""} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium`}>
                <item.icon className={`w-6 h-6 mr-3 transition-colors ${isParentActive ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400 group-hover:text-teal-600"}`} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="py-2 space-y-1 pl-1">
                            {item.children.map(child => <SubMenuItem key={child.href} item={child} />)}
                        </div>
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
};

const UserProfile = () => {
    const { auth } = usePage().props;
    const user = auth.user;
    return (
        <div className="flex items-center p-4 mt-auto rounded-lg bg-gray-50 dark:bg-gray-700/30">
            <img className="w-10 h-10 rounded-full object-cover" src={`https://ui-avatars.com/api/?name=${user.name}&background=teal&color=fff`} alt={user.name} />
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
        </div>
    );
};


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role || 'default';
    const menu = menuConfig[userRole] || menuConfig.default;

    return (
        <>
            {/* Overlay untuk mobile view */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="h-full flex flex-col px-3 py-4 overflow-y-auto">
                    <div className="flex items-center justify-between px-2.5 mb-6">
                        <Link href={route('dashboard')} className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    <ul className="space-y-2 flex-grow">
                        {menu.map(item => <MenuItem key={item.label} item={item} />)}
                    </ul>

                    <UserProfile />

                    <Link href={route('logout')} method="post" as="button" className="flex items-center p-3 mt-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Sign Out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}