import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumbs from "@/Components/Breadcrumbs";
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Select from 'react-select';

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
        } else {
            setFilteredSantris([]);
        }
        setData('santri_id', '');
        setSelectedSantriData(null);
    }, [data.year]);

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
    
    const santriOptions = filteredSantris.map(santri => ({ value: santri.id, label: santri.nama_santri }));
    const halamanAngkaOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }));
    const halamanSisiOptions = [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }];

    const handleSubmit = (e) => { e.preventDefault(); post(route('hafalan.store')); };

    const breadcrumbs = [{ label: "Home", href: route("dashboard") }, { label: "Hafalan", href: route("hafalan.index") }, { label: "Input Setoran" }];

    const customSelectStyles = {
        control: (base, state) => ({ ...base, backgroundColor: 'rgb(55 65 81)', borderColor: state.isFocused ? '#319795' : 'rgb(75 85 99)', boxShadow: state.isFocused ? '0 0 0 1px #319795' : 'none', '&:hover': { borderColor: '#319795' } }),
        singleValue: (base) => ({ ...base, color: 'white' }),
        input: (base) => ({ ...base, color: 'white' }),
        menu: (base) => ({ ...base, backgroundColor: 'rgb(55 65 81)' }),
        option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? '#2C7A7B' : isFocused ? 'rgb(75 85 99)' : 'rgb(55 65 81)', color: 'white', ':active': { ...styles[':active'], backgroundColor: '#285E61' } }),
        placeholder: (base) => ({ ...base, color: 'rgb(156 163 175)' }),
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Input Setoran Hafalan" />
            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formulir Setoran Hafalan</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="year" value="Filter Santri per Tahun Masuk" />
                                        <select id="year" value={data.year} onChange={(e) => setData('year', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                                            <option value="">Pilih Tahun Angkatan</option>
                                            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="santri_id" value="Santri" />
                                        <Select id="santri_id" options={santriOptions} value={santriOptions.find(s => s.value === data.santri_id)} isDisabled={!data.year || filteredSantris.length === 0} placeholder={!data.year ? "Pilih tahun dulu..." : "Pilih Santri..."} onChange={handleSantriChange} styles={customSelectStyles} className="mt-1" />
                                        <InputError message={errors.santri_id} className="mt-2" />
                                    </div>
                                </div>
                                {selectedSantriData && (
                                    <div className={`p-4 rounded-lg ${!selectedSantriData.halaqohs || selectedSantriData.halaqohs.length === 0 ? 'bg-red-100 dark:bg-red-900/40' : 'bg-teal-100 dark:bg-teal-900/40'}`}>
                                        {(!selectedSantriData.halaqohs || selectedSantriData.halaqohs.length === 0) ? (
                                            <p className="text-sm text-red-800 dark:text-red-200">
                                                Santri ini belum terdaftar di halaqoh manapun. Silakan <Link href={route('halaqohs.index')} className="font-bold underline">daftarkan</Link> terlebih dahulu.
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-sm text-teal-800 dark:text-teal-200">
                                                    Halaqoh: <span className="font-semibold">{selectedSantriData.halaqohs[0]?.name}</span>
                                                </p>
                                                <p className="text-sm text-teal-800 dark:text-teal-200">
                                                    Muhafidz: <span className="font-semibold">{selectedSantriData.halaqohs[0]?.teacher?.user?.name}</span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <InputLabel htmlFor="juz" value="Juz" />
                                    <TextInput id="juz" type="number" name="juz" value={data.juz} className="mt-1 block w-full" onChange={(e) => setData('juz', e.target.value)} min="1" max="30" />
                                    <InputError message={errors.juz} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Halaman" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1/2"><Select styles={customSelectStyles} options={halamanAngkaOptions} defaultValue={halamanAngkaOptions[0]} onChange={option => setData('halaman_angka', option.value)} /></div>
                                        <div className="w-1/2"><Select styles={customSelectStyles} options={halamanSisiOptions} defaultValue={halamanSisiOptions[0]} onChange={option => setData('halaman_sisi', option.value)} /></div>
                                    </div>
                                    <InputError message={errors.halaman} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nilai" value="Nilai" />
                                    <TextInput id="nilai" type="number" name="nilai" value={data.nilai} className="mt-1 block w-full" onChange={(e) => setData('nilai', e.target.value)} min="0" max="100" />
                                    <InputError message={errors.nilai} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end">
                                    <PrimaryButton disabled={processing}>Simpan Setoran</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
