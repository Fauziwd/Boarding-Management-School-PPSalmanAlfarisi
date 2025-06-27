import React, { useState } from 'react';
import Sidebar from '@/Layouts/Sidebar'; // Pastikan path ini benar
import { usePage } from '@inertiajs/react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import DarkModeToggle from '@/Components/DarkModeToggle';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar dipanggil di sini */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Kontainer utama untuk konten di sebelah kanan sidebar */}
            {/* Class 'lg:ml-64' memberikan ruang seukuran sidebar di layar besar */}
            <div className="flex flex-col flex-1 lg:ml-64">
                
                {/* Navbar Bagian Atas */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Tombol Hamburger untuk Mobile */}
                            <button
                                type="button"
                                className="p-2 text-gray-600 dark:text-gray-300 rounded-md lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>

                            {/* Spacer untuk mendorong item ke kanan */}
                            <div className="flex-1"></div>

                            {/* Grup Tombol di Kanan */}
                            <div className="flex items-center gap-4">
                               <DarkModeToggle />
                               <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
                                           <img className="w-8 h-8 rounded-full object-cover" src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=gray&color=fff`} alt={auth.user.name} />
                                           <span className="hidden sm:inline">{auth.user.name}</span>
                                           <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{auth.user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize truncate">{auth.user.role}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 dark:text-red-400">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Konten Halaman Utama */}
                <main className="flex-1 p-6 lg:p-8">
                    {/* Header/Judul halaman sekarang dirender di dalam area konten utama */}
                    {header && (
                        <div className="mb-6">
                           {header}
                        </div>
                    )}
                    
                    {/* Isi halaman dari setiap Page */}
                    {children}
                </main>
            </div>
        </div>
    );
}