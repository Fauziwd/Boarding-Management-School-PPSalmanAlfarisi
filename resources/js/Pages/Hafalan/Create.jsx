import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBook, FiAward, FiChevronDown, FiAlertTriangle, FiCheckCircle, FiInfo, FiPlus, FiSave } from 'react-icons/fi';

export default function HafalanCreate({ auth, santris }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        santri_id: '',
        teacher_id: '',
        juz: '',
        halaman_angka: '1',
        halaman_sisi: 'A',
        nilai: '',
        year: '',
    });

    transform((data) => ({ ...data, halaman: `${data.halaman_angka}${data.halaman_sisi}` }));

    const [uniqueYears, setUniqueYears] = useState([]);
    const [filteredSantris, setFilteredSantris] = useState([]);
    const [selectedSantriData, setSelectedSantriData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (santris) {
            const years = [...new Set(santris.map((s) => s.nis.toString().slice(0, 4)))].sort((a, b) => b - a);
            setUniqueYears(years);
        }
    }, [santris]);

    useEffect(() => {
        if (data.year) {
            const filtered = santris.filter((s) => s.nis.toString().startsWith(data.year));
            setFilteredSantris(filtered);
            setActiveStep(2);
        } else {
            setFilteredSantris([]);
            setData('santri_id', '');
            setSelectedSantriData(null);
        }
    }, [data.year]);

    useEffect(() => {
        if (data.santri_id) {
            setActiveStep(3);
        }
    }, [data.santri_id]);

    const handleSantriChange = (option) => {
        if (option) {
            const santri = santris.find(s => s.id === option.value);
            setSelectedSantriData(santri);
            setData(prevData => ({
                ...prevData,
                santri_id: santri.id,
                teacher_id: santri.halaqohs[0]?.teacher?.id || ''
            }));
        } else {
            setSelectedSantriData(null);
            setData(prevData => ({ ...prevData, santri_id: '', teacher_id: '' }));
        }
    };
    
    const santriOptions = filteredSantris.map(santri => ({ 
        value: santri.id, 
        label: (
            <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 mr-3">
                    <FiUser className="w-4 h-4" />
                </span>
                <div>
                    <div className="font-medium">{santri.nama_santri}</div>
                    <div className="text-xs text-gray-500">NIS: {santri.nis}</div>
                </div>
            </div>
        )
    }));

    const halamanAngkaOptions = Array.from({ length: 10 }, (_, i) => ({ 
        value: i + 1, 
        label: `${i + 1}` 
    }));

    const halamanSisiOptions = [
        { value: 'A', label: 'A (Depan)' },
        { value: 'B', label: 'B (Belakang)' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await post(route('hafalan.store'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") }, 
        { label: "Hafalan", href: route("hafalan.index") }, 
        { label: "Input Setoran" }
    ];

    const customSelectStyles = {
        control: (base, state) => ({ 
            ...base, 
            backgroundColor: 'rgb(55 65 81)', 
            borderColor: state.isFocused ? '#10b981' : 'rgb(75 85 99)', 
            boxShadow: state.isFocused ? '0 0 0 1px #10b981' : 'none', 
            minHeight: '44px',
            borderRadius: '0.5rem',
            '&:hover': { borderColor: '#10b981' } 
        }),
        singleValue: (base) => ({ ...base, color: 'white' }),
        input: (base) => ({ ...base, color: 'white' }),
        menu: (base) => ({ ...base, backgroundColor: 'rgb(55 65 81)', zIndex: 20, borderRadius: '0.5rem', overflow: 'hidden' }),
        option: (styles, { isFocused, isSelected }) => ({ 
            ...styles, 
            backgroundColor: isSelected ? '#059669' : isFocused ? 'rgb(75 85 99)' : 'rgb(55 65 81)', 
            color: 'white', 
            ':active': { ...styles[':active'], backgroundColor: '#047857' } 
        }),
        placeholder: (base) => ({ ...base, color: 'rgb(156 163 175)' }),
        dropdownIndicator: (base) => ({ ...base, color: 'rgb(156 163 175)' }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: 'rgb(75 85 99)' }),
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Input Setoran Hafalan" />
            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbs} />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl mt-6 border border-gray-200 dark:border-gray-700"
                    >
                        {/* Header dengan gradient */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm mr-4">
                                    <FiBook className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Formulir Setoran Hafalan</h2>
                                    <p className="text-sm opacity-90 mt-1">Input data setoran hafalan Al-Qur'an santri</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="px-6 pt-6">
                            <div className="flex items-center justify-between mb-8 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                                
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="relative z-10">
                                        <div className={`flex flex-col items-center ${step < activeStep ? 'text-emerald-600 dark:text-emerald-400' : step === activeStep ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step <= activeStep ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700'} border-2 ${step === activeStep ? 'border-emerald-500' : 'border-transparent'}`}>
                                                {step < activeStep ? (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="font-medium">{step}</span>
                                                )}
                                            </div>
                                            <span className="text-xs mt-2 font-medium">
                                                {step === 1 ? 'Tahun' : step === 2 ? 'Santri' : 'Hafalan'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Step 1: Tahun Angkatan */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={`${activeStep >= 1 ? 'block' : 'hidden'}`}
                                >
                                    <div className="mb-4 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-3">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">1</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tahun Angkatan</h3>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                        <InputLabel htmlFor="year" value="Tahun Angkatan Santri" className="mb-2 font-medium" />
                                        <div className="relative">
                                            <select 
                                                id="year" 
                                                value={data.year} 
                                                onChange={(e) => setData('year', e.target.value)}
                                                className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-all duration-200"
                                            >
                                                <option value="">Pilih Tahun Angkatan</option>
                                                {uniqueYears.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <FiChevronDown className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            <FiInfo className="flex-shrink-0 mr-2" />
                                            <span>Pilih tahun angkatan santri untuk memfilter daftar santri</span>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Step 2: Pilih Santri */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className={`${activeStep >= 2 ? 'block' : 'hidden'}`}
                                >
                                    <div className="mb-4 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-3">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">2</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pilih Santri</h3>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                        <InputLabel htmlFor="santri_id" value="Cari Santri" className="mb-2 font-medium" />
                                        <Select 
                                            id="santri_id" 
                                            options={santriOptions} 
                                            value={santriOptions.find(s => s.value === data.santri_id)} 
                                            isDisabled={!data.year || filteredSantris.length === 0} 
                                            placeholder={!data.year ? "Pilih tahun dulu..." : "Cari berdasarkan nama atau NIS..."} 
                                            onChange={handleSantriChange} 
                                            styles={customSelectStyles} 
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            components={{
                                                DropdownIndicator: () => (
                                                    <div className="pr-3">
                                                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )
                                            }}
                                        />
                                        <InputError message={errors.santri_id} className="mt-2" />
                                        
                                        {data.year && filteredSantris.length === 0 && (
                                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
                                                Tidak ada santri ditemukan untuk tahun angkatan {data.year}.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <AnimatePresence>
                                        {selectedSantriData && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`mt-4 p-4 rounded-xl ${!selectedSantriData.halaqohs || selectedSantriData.halaqohs.length === 0 ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50' : 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50'}`}
                                            >
                                                {(!selectedSantriData.halaqohs || selectedSantriData.halaqohs.length === 0) ? (
                                                    <div className="flex items-start">
                                                        <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                                                Santri belum terdaftar di halaqoh
                                                            </p>
                                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                                Silakan <Link href={route('halaqohs.index')} className="font-bold underline hover:text-red-900 dark:hover:text-red-100">daftarkan santri</Link> ke halaqoh terlebih dahulu.
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start">
                                                        <FiCheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                                                Data halaqoh santri
                                                            </p>
                                                            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                                                                <span className="font-semibold">Halaqoh:</span> {selectedSantriData.halaqohs[0]?.name}
                                                            </p>
                                                            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                                                                <span className="font-semibold">Muhafidz:</span> {selectedSantriData.halaqohs[0]?.teacher?.user?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                
                                {/* Step 3: Data Hafalan */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className={`${activeStep >= 3 ? 'block' : 'hidden'}`}
                                >
                                    <div className="mb-4 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-3">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">3</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Hafalan</h3>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <InputLabel htmlFor="juz" value="Juz" className="mb-2 font-medium" />
                                                <div className="relative">
                                                    <TextInput 
                                                        id="juz" 
                                                        type="number" 
                                                        name="juz" 
                                                        value={data.juz} 
                                                        className="block w-full pl-4 pr-12 py-3 rounded-xl" 
                                                        onChange={(e) => setData('juz', e.target.value)} 
                                                        min="1" 
                                                        max="30" 
                                                        placeholder="Masukkan nomor juz"
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <FiAward className="h-5 w-5" />
                                                    </div>
                                                </div>
                                                <InputError message={errors.juz} className="mt-2" />
                                            </div>
                                            
                                            <div>
                                                <InputLabel value="Halaman" className="mb-2 font-medium" />
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <Select 
                                                            styles={customSelectStyles} 
                                                            options={halamanAngkaOptions} 
                                                            defaultValue={halamanAngkaOptions[0]} 
                                                            onChange={option => setData('halaman_angka', option.value)} 
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                    <div className="text-gray-400 font-medium">-</div>
                                                    <div className="flex-1">
                                                        <Select 
                                                            styles={customSelectStyles} 
                                                            options={halamanSisiOptions} 
                                                            defaultValue={halamanSisiOptions[0]} 
                                                            onChange={option => setData('halaman_sisi', option.value)} 
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <InputError message={errors.halaman} className="mt-2" />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-5">
                                            <InputLabel htmlFor="nilai" value="Nilai Setoran" className="mb-2 font-medium" />
                                            <div className="relative">
                                                <TextInput 
                                                    id="nilai" 
                                                    type="number" 
                                                    name="nilai" 
                                                    value={data.nilai} 
                                                    className="block w-full pl-4 pr-16 py-3 rounded-xl" 
                                                    onChange={(e) => setData('nilai', e.target.value)} 
                                                    min="0" 
                                                    max="100" 
                                                    placeholder="0 - 100"
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <span className="text-sm">/ 100</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FiInfo className="flex-shrink-0 mr-2" />
                                                <span>Berikan nilai antara 0 sampai 100</span>
                                            </div>
                                            <InputError message={errors.nilai} className="mt-2" />
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
                                >
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
                                    </div>
                                    
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <PrimaryButton 
                                            disabled={processing || isSubmitting || !selectedSantriData || (!selectedSantriData.halaqohs || selectedSantriData.halaqohs.length === 0)} 
                                            className="flex items-center px-6 py-3 rounded-xl shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave className="mr-2" />
                                                    Simpan Setoran
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </motion.div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}