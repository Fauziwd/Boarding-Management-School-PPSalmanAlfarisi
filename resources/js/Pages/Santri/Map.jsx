import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const INDONESIA_JSON_URL = '/maps/indonesia.json';
const COLOR_PALETTE = ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F'];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function SantriMap({ auth, santriByProvince, totalSantri }) {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Intersection Observer hooks for scroll animations
    const [headerRef, headerInView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });
    
    const [mapRef, mapInView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });
    
    const [chartRef, chartInView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    const provinceData = useMemo(() => {
        const data = {};
        santriByProvince.forEach(p => {
            data[p.name] = p;
        });
        return data;
    }, [santriByProvince]);

    const colorScale = useMemo(() => {
        const counts = santriByProvince.map(p => p.count).filter(c => c > 0);
        if (counts.length === 0) {
            return () => '#EAECF0';
        }
        const maxCount = Math.max(...counts);
        return scaleQuantize().domain([1, maxCount]).range(COLOR_PALETTE);
    }, [santriByProvince]);

    const chartData = useMemo(() => {
        return [...santriByProvince].sort((a, b) => b.count - a.count);
    }, [santriByProvince]);

    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (geo) => {
        const provinceName = geo.properties.name;
        const data = provinceData[provinceName];
        setHoveredProvince(provinceName);
        setTooltipContent(`${provinceName}: ${data ? data.count : 0} santri`);
    };

    const handleMouseLeave = () => {
        setHoveredProvince(null);
        setTooltipContent('');
    };

    const handleProvinceClick = (geo) => {
        const provinceName = geo.properties.name;
        const data = provinceData[provinceName];
        if (data) {
            setSelectedProvince(data);
        } else {
            setSelectedProvince({ name: provinceName, count: 0, santris: [], yearlyData: [] });
        }
    };
    
    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload[0]) {
            const provinceName = data.activePayload[0].payload.name;
            const provinceDetails = provinceData[provinceName];
            if (provinceDetails) {
                setSelectedProvince(provinceDetails);
            }
        }
    };
    
    const displayProvince = selectedProvince || (hoveredProvince ? provinceData[hoveredProvince] : null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Peta Sebaran Santri</h2>}
        >
            <Head title="Peta Sebaran Santri" />

            <AnimatePresence>
                {tooltipContent && (
                    <motion.div
                        style={{ 
                            left: tooltipPosition.x + 10, 
                            top: tooltipPosition.y + 10,
                            backdropFilter: 'blur(4px)'
                        }}
                        className="fixed z-50 px-3 py-1.5 text-sm font-medium text-white bg-gray-900/90 rounded-lg shadow-lg dark:bg-gray-700/90 border border-gray-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tooltipContent}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="py-8" onMouseMove={handleMouseMove}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Dashboard Overview Card */}
                    <motion.div 
                        ref={headerRef}
                        initial="hidden"
                        animate={headerInView ? "visible" : "hidden"}
                        variants={fadeIn}
                        className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-700 dark:to-cyan-800 rounded-xl shadow-lg p-6 text-white"
                    >
                        <motion.div variants={itemVariants}>
                            <h1 className="text-2xl font-bold mb-2">Dashboard Sebaran Santri</h1>
                            <p className="opacity-90">Visualisasi data distribusi santri di seluruh Indonesia</p>
                        </motion.div>
                        <motion.div 
                            className="mt-4 flex items-center"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="bg-white/20 p-3 rounded-lg mr-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </motion.div>
                            <div>
                                <p className="text-sm opacity-80">Total Santri Terdaftar</p>
                                <motion.p 
                                    className="text-3xl font-bold"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {totalSantri}
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Map Section */}
                        <motion.div 
                            variants={slideUp}
                            ref={mapRef}
                            animate={mapInView ? "visible" : "hidden"}
                            className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Peta Sebaran Santri</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Klik provinsi untuk detail</span>
                            </div>
                            <motion.div 
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                whileHover={{ scale: 1.005 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{ scale: 1000, center: [118, -2.5] }}
                                    style={{ width: "100%", height: "auto" }}
                                >
                                    <Geographies geography={INDONESIA_JSON_URL}>
                                        {({ geographies }) =>
                                            geographies.map(geo => {
                                                const provinceName = geo.properties.name;
                                                const data = provinceData[provinceName];
                                                const isSelected = selectedProvince && selectedProvince.name === provinceName;
                                                return (
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        onMouseEnter={() => handleMouseEnter(geo)}
                                                        onMouseLeave={handleMouseLeave}
                                                        onClick={() => handleProvinceClick(geo)}
                                                        style={{
                                                            default: { 
                                                                fill: data && data.count > 0 ? colorScale(data.count) : '#EAECF0', 
                                                                outline: 'none', 
                                                                stroke: '#FFFFFF', 
                                                                strokeWidth: 0.5,
                                                                transition: 'fill 0.3s ease'
                                                            },
                                                            hover: { 
                                                                fill: '#00ACC1', 
                                                                outline: 'none', 
                                                                stroke: '#FFFFFF', 
                                                                strokeWidth: 0.5 
                                                            },
                                                            pressed: { 
                                                                fill: isSelected ? '#00838F' : '#E42', 
                                                                outline: 'none' 
                                                            },
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    </Geographies>
                                </ComposableMap>
                            </motion.div>
                        </motion.div>

                        {/* Info Panel */}
                        <motion.div 
                            variants={slideUp}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 flex flex-col"
                        >
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Informasi Sebaran</h3>
                                
                                <motion.div 
                                    className="p-5 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-inner mb-6 border border-gray-100 dark:border-gray-700"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Santri</p>
                                    <motion.p 
                                        className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {totalSantri}
                                    </motion.p>
                                </motion.div>
                                
                                {displayProvince ? (
                                    <motion.div 
                                        className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl shadow-inner border border-teal-100 dark:border-teal-900/50 transition-all duration-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 dark:text-teal-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-lg font-bold text-teal-800 dark:text-teal-200">{displayProvince.name}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 dark:text-teal-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <p className="text-xl font-semibold text-teal-600 dark:text-teal-300">{displayProvince.count} Santri</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center border border-dashed border-gray-200 dark:border-gray-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400">Arahkan kursor ke provinsi di peta untuk melihat info</p>
                                    </motion.div>
                                )}
                            </div>
                            
                            <motion.div 
                                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                                variants={itemVariants}
                            >
                                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    Legenda Peta
                                </h4>
                                <motion.div 
                                    className="grid grid-cols-2 gap-2"
                                    variants={containerVariants}
                                >
                                    {COLOR_PALETTE.map((color, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="flex items-center text-sm"
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="w-5 h-5 rounded-sm mr-2 border border-white dark:border-gray-700 shadow-sm" style={{ backgroundColor: color }}></div>
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {index === 0 ? 'Sedikit' : ''}
                                                {index === Math.floor(COLOR_PALETTE.length/2) ? 'Sedang' : ''}
                                                {index === COLOR_PALETTE.length - 1 ? 'Banyak' : ''}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Main Bar Chart */}
                    <motion.div 
                        ref={chartRef}
                        initial="hidden"
                        animate={chartInView ? "visible" : "hidden"}
                        variants={scaleIn}
                        className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Grafik Sebaran Santri per Provinsi</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Klik bar untuk melihat detail provinsi</span>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart 
                                    data={chartData} 
                                    onClick={handleBarClick}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={auth.user.dark_mode ? '#374151' : '#E5E7EB'} />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={80} 
                                        interval={0} 
                                        tick={{ 
                                            fontSize: 10, 
                                            fill: auth.user.dark_mode ? '#D1D5DB' : '#4B5563' 
                                        }} 
                                    />
                                    <YAxis 
                                        tick={{
                                            fill: auth.user.dark_mode ? '#D1D5DB' : '#4B5563'
                                        }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} 
                                        contentStyle={{ 
                                            backgroundColor: auth.user.dark_mode ? '#1F2937' : '#FFFFFF',
                                            borderColor: auth.user.dark_mode ? '#374151' : '#E5E7EB',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }} 
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        name="Jumlah Santri" 
                                        radius={[4, 4, 0, 0]}
                                        animationBegin={100}
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={
                                                    selectedProvince && selectedProvince.name === entry.name 
                                                        ? '#00838F' 
                                                        : '#00ACC1'
                                                } 
                                                strokeWidth={selectedProvince && selectedProvince.name === entry.name ? 2 : 0}
                                                stroke="#E5E7EB"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {selectedProvince && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                Detail Provinsi: {selectedProvince.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {selectedProvince.count} santri terdaftar
                                            </p>
                                        </div>
                                        <motion.button 
                                            onClick={() => setSelectedProvince(null)}
                                            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Tutup Detail
                                        </motion.button>
                                    </div>

                                    {selectedProvince.yearlyData && selectedProvince.yearlyData.length > 0 && (
                                        <motion.div 
                                            className="mb-8"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Distribusi Santri per Tahun Masuk
                                            </h4>
                                            <div style={{ width: '100%', height: 250 }}>
                                                <ResponsiveContainer>
                                                    <BarChart 
                                                        data={selectedProvince.yearlyData}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke={auth.user.dark_mode ? '#374151' : '#E5E7EB'} />
                                                        <XAxis 
                                                            dataKey="year" 
                                                            tick={{ 
                                                                fontSize: 12, 
                                                                fill: auth.user.dark_mode ? '#D1D5DB' : '#4B5563' 
                                                            }} 
                                                        />
                                                        <YAxis 
                                                            allowDecimals={false} 
                                                            tick={{ 
                                                                fontSize: 12, 
                                                                fill: auth.user.dark_mode ? '#D1D5DB' : '#4B5563' 
                                                            }} 
                                                        />
                                                        <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: auth.user.dark_mode ? '#1F2937' : '#FFFFFF',
                                                                borderColor: auth.user.dark_mode ? '#374151' : '#E5E7EB',
                                                                borderRadius: '0.5rem'
                                                            }} 
                                                        />
                                                        <Legend />
                                                        <Bar 
                                                            dataKey="count" 
                                                            name="Jumlah Santri" 
                                                            fill="#26A69A" 
                                                            radius={[4, 4, 0, 0]}
                                                            animationBegin={200}
                                                            animationDuration={1500}
                                                            animationEasing="ease-out"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {selectedProvince.santris && selectedProvince.santris.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Daftar Santri ({selectedProvince.count} orang)
                                            </h4>
                                            <motion.div 
                                                className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Santri</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {selectedProvince.santris.map((santri, index) => (
                                                            <motion.tr 
                                                                key={santri.id} 
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.05 * index }}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{santri.nama_santri}</td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
