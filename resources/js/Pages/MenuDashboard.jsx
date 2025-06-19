import React from "react";
import {
    UserGroupIcon,
    UserPlusIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ChevronRightIcon, // Ikon baru untuk indikator hover
} from "@heroicons/react/24/outline";

// Definisikan item menu dengan style gradien dan warna ikon
const menuItems = [
    {
        label: "Student Data",
        href: "santris.index",
        icon: UserGroupIcon,
        description: "See and manage your student",
        gradient: "from-teal-500 to-cyan-600",
        iconColor: "bg-teal-600",
    },
    {
        label: "User Data",
        href: "users",
        icon: UserPlusIcon,
        description: "Manage user accounts",
        gradient: "from-sky-500 to-indigo-600",
        iconColor: "bg-sky-600",
    },
    {
        label: "Academic Details",
        href: "akademik.index",
        icon: AcademicCapIcon,
        description: "Manage academic achievments",
        gradient: "from-amber-500 to-orange-600",
        iconColor: "bg-amber-600",
    },
    {
        label: "Hifdz Data",
        href: "hafalan.index",
        icon: BookOpenIcon,
        description: "Manage your students' hifdz",
        gradient: "from-violet-500 to-purple-600",
        iconColor: "bg-violet-600",
    },
];

function MenuItem({ item, LinkComponent }) {
    const IconComponent = item.icon;
    // Pengecekan route() harus ada di dalam lingkup komponen React
    // agar dapat diakses dengan benar.
    const routeExists = typeof route !== "undefined" && route().has(item.href);
    const finalHref = routeExists ? route(item.href) : "#";

    if (!routeExists) {
        console.warn(
            `[MenuDashboard] Peringatan: Route '${item.href}' tidak ditemukan.`
        );
    }

    return (
        // Gunakan 'group' untuk mengontrol elemen anak saat parent di-hover
        <LinkComponent
            href={finalHref}
            className={`group relative block overflow-hidden rounded-xl p-6 text-gray-800 dark:text-gray-100 transition-all duration-300 ${item.gradient} hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-black/40 hover:-translate-y-1`}
        >
            <div className="relative">
                {/* Styling Ikon dengan Latar Belakang */}
                <div
                    className={`mb-4 inline-block rounded-lg p-3 ${item.iconColor}`}
                >
                    <IconComponent
                        className="h-8 w-8 text-white"
                        aria-hidden="true"
                    />
                </div>

                <h4 className="text-xl font-bold">{item.label}</h4>
                <p className="mt-1 text-sm font-light opacity-90">
                    {item.description}
                </p>
            </div>

            {/* Dekorasi Absolut di Latar Belakang */}
            <div className="absolute bottom-9 -right-8 h-52 w-20 rounded-full bg-teal-600 dark:bg-white/10 group-hover:shadow-[inset_0_0_10px_0_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-150" />

            {/* Ikon Chevron yang Muncul Saat Hover */}

            {/* <ChevronRightIcon
  className="absolute right-4 top-4 h-8 w-8 text-white opacity-0 transform translate-x-full transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
/> */}

            <div className="absolute right-4 top-1/2 flex h-full -translate-y-1/2 transform items-center justify-center text-white">
                <span className="font-kufi text-2xl font-bold [writing-mode:vertical-rl] transform rotate-180 -translate-x-full opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100">
                    Check it!
                </span>
            </div>
        </LinkComponent>
    );
}

export default function ModernMenuDashboard({ LinkComponent }) {
    if (!LinkComponent) {
        return null;
    }

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        LinkComponent={LinkComponent}
                    />
                ))}
            </div>
        </div>
    );
}
