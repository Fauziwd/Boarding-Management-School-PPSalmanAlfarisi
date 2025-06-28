import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeftIcon, 
    PhoneIcon, 
    MapPinIcon, 
    AcademicCapIcon, 
    UserGroupIcon, 
    BookOpenIcon, 
    BuildingOffice2Icon,
    EnvelopeIcon,
    IdentificationIcon,
    CalendarIcon,
    ClockIcon,
    ChartBarIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { 
    ChevronRightIcon,
    StarIcon,
    CheckBadgeIcon
} from '@heroicons/react/20/solid';

const getRoleColor = (role) => {
    switch (role) {
        case 'Murobbi': 
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800';
        case 'Muhafidz': 
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-800';
        case 'Mudaris': 
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800';
        default: 
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
};

const GroupCard = ({ group, routeName, icon, color }) => (
    <div className={`relative p-5 rounded-xl border-l-4 ${color} bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{group.academic_year.year} - Semester {group.academic_year.semester}</span>
                </div>
            </div>
            <Link 
                href={route(routeName, group.id)} 
                className="flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
            >
                <span>Lihat Detail</span>
                <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{group.santris_count} Santri</span>
            </div>
            <div className="flex items-center">
                <StarIcon className="w-4 h-4 mr-1 text-amber-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Aktif</span>
            </div>
        </div>
    </div>
);

const GroupSection = ({ title, groups, routeName, icon, color }) => (
    <div className="space-y-4">
        <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color} bg-opacity-20 mr-3`}>
                {React.cloneElement(icon, { className: `w-5 h-5 ${color.replace('text-', 'text-').split(' ')[0]}` })}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="ml-auto px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {groups?.length || 0} Kelompok
            </span>
        </div>
        
        {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map(group => (
                    <GroupCard 
                        key={group.id} 
                        group={group} 
                        routeName={routeName} 
                        icon={icon}
                        color={color}
                    />
                ))}
            </div>
        ) : (
            <div className="p-6 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 italic">Guru ini belum mengampu kelompok {title}</p>
            </div>
        )}
    </div>
);

export default function Show({ auth, teacher }) {
    const user = teacher.user;
    const stats = [
        { name: 'Total Kelompok', value: (teacher.usrohs?.length || 0) + (teacher.halaqohs?.length || 0) + (teacher.study_classes?.length || 0), icon: ChartBarIcon },
        { name: 'Total Santri', value: 0, icon: UserGroupIcon }, // You would calculate this from your data
        { name: 'Bergabung', value: new Date(user.created_at).toLocaleDateString('id-ID'), icon: CalendarIcon },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link 
                            href={route('teachers.index')} 
                            className="mr-4 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Profil Guru
                        </h2>
                    </div>
                    <Link
                        href={route('teachers.edit', teacher.id)}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                    >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Profil
                    </Link>
                </div>
            }
        >
            <Head title={`${user.name} - Profil Guru`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
                            <div className="relative mb-6 md:mb-0 md:mr-8">
                                <img 
                                    src={user.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=200`} 
                                    alt={user.name} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md">
                                    <CheckBadgeIcon className="w-6 h-6 text-teal-500" />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                    {teacher.roles?.map(role => (
                                        <span 
                                            key={role} 
                                            className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(role)} shadow-sm`}
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-white/90">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 mr-2" />
                                        <span>{teacher.phone_number || 'No. Telepon tidak tersedia'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, statIdx) => (
                            <div 
                                key={stat.name}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-teal-100/50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 mr-4">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Bio */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <IdentificationIcon className="w-5 h-5 mr-2 text-teal-500" />
                                    Informasi Pribadi
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">NIP</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{teacher.nip || 'Tidak tersedia'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Jenis Kelamin</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{teacher.gender === 'male' ? 'Laki-laki' : teacher.gender === 'female' ? 'Perempuan' : 'Tidak tersedia'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Lahir</p>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {teacher.birth_date ? new Date(teacher.birth_date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Tidak tersedia'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <MapPinIcon className="w-5 h-5 mr-2 text-teal-500" />
                                    Alamat
                                </h3>
                                {teacher.address ? (
                                    <p className="text-gray-700 dark:text-gray-300">{teacher.address}</p>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 italic">Alamat tidak tersedia</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Groups */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <GroupSection 
                                    title="Kelompok Usroh" 
                                    groups={teacher.usrohs} 
                                    routeName="usrohs.show" 
                                    icon={<UserGroupIcon />}
                                    color="text-blue-500"
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <GroupSection 
                                    title="Halaqoh" 
                                    groups={teacher.halaqohs} 
                                    routeName="halaqohs.show" 
                                    icon={<BookOpenIcon />}
                                    color="text-green-500"
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <GroupSection 
                                    title="Kelas" 
                                    groups={teacher.study_classes} 
                                    routeName="study-classes.show" 
                                    icon={<BuildingOffice2Icon />}
                                    color="text-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}