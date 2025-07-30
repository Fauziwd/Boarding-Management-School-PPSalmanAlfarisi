import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Fungsi untuk mengubah format string menjadi Title Case
const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

export default function SantriMap({ auth, santrisByProvince }) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [santriInProvince, setSantriInProvince] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredProvince, setHoveredProvince] = useState('');
    const geoJsonRef = useRef();

    // Mengambil data GeoJSON saat komponen dimuat
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson')
            .then(response => response.json())
            .then(data => {
                setGeoJsonData(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching GeoJSON:", error);
                setIsLoading(false);
            });
    }, []);

    // Fungsi saat provinsi di-klik
    const handleProvinceClick = (provinceName) => {
        const provinceTitleCase = toTitleCase(provinceName);
        setSelectedProvince(provinceTitleCase);
        
        const santris = santrisByProvince[provinceTitleCase] || [];
        setSantriInProvince(santris);

        // Proses data untuk chart jika ada santri
        if (santris.length > 0) {
            const countsByYear = santris.reduce((acc, santri) => {
                if (santri.nis && santri.nis.length >= 4) {
                    const year = santri.nis.substring(0, 4);
                    if (!isNaN(year)) {
                        acc[year] = (acc[year] || 0) + 1;
                    }
                }
                return acc;
            }, {});

            const formattedChartData = Object.keys(countsByYear).map(year => ({
                tahun: year,
                'Jumlah Santri': countsByYear[year],
            })).sort((a, b) => a.tahun.localeCompare(b.tahun)); // Urutkan berdasarkan tahun

            setChartData(formattedChartData);
        } else {
            setChartData([]); // Kosongkan data chart
        }
    };
    
    // Style untuk layer peta
    const style = (feature) => {
        const provinceName = toTitleCase(feature.properties.Propinsi);
        const hasSantri = santrisByProvince[provinceName] && santrisByProvince[provinceName].length > 0;
        return {
            fillColor: hasSantri ? '#10B981' : '#D1D5DB',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    // Interaksi untuk setiap provinsi di peta
    const onEachFeature = (feature, layer) => {
        const provinceName = feature.properties.Propinsi;
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ weight: 2, color: '#333', fillOpacity: 0.9 });
                setHoveredProvince(toTitleCase(provinceName));
            },
            mouseout: (e) => {
                geoJsonRef.current.resetStyle(e.target);
                setHoveredProvince('');
            },
            click: () => handleProvinceClick(provinceName),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Peta Sebaran Santri</h2>}
        >
            <Head title="Peta Sebaran Santri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Kolom Peta */}
                                <div className="w-full md:w-2/3 h-[70vh] relative rounded-lg">
                                    {isLoading ? <div className="flex justify-center items-center h-full">Memuat Peta...</div> : (
                                        <MapContainer center={[-2.548926, 118.0148634]} zoom={5} style={{ height: '100%', width: '100%' }} className="rounded-lg">
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            {geoJsonData && <GeoJSON ref={geoJsonRef} data={geoJsonData} style={style} onEachFeature={onEachFeature} />}
                                            {hoveredProvince && (
                                                <div className="leaflet-top leaflet-right">
                                                    <div className="leaflet-control leaflet-bar bg-white bg-opacity-80 p-2 rounded-md shadow-md m-2">
                                                        <h4 className="font-bold text-gray-800">{hoveredProvince}</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </MapContainer>
                                    )}
                                </div>

                                {/* Kolom Daftar Santri & Chart */}
                                <div className="w-full md:w-1/3">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full max-h-[70vh] overflow-y-auto">
                                        {selectedProvince ? (
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">Daftar Santri dari {selectedProvince}</h3>
                                                {santriInProvince.length > 0 ? (
                                                    <ul className="list-disc pl-5 space-y-1 max-h-48 overflow-y-auto mb-6">
                                                        {santriInProvince.map(santri => (
                                                            <li key={santri.nis}>{santri.nama_santri}</li>
                                                        ))}
                                                    </ul>
                                                ) : <p>Tidak ada data santri.</p>}

                                                <hr className="my-4 dark:border-gray-600"/>

                                                <h4 className="font-bold text-lg mb-4">Jumlah Santri per Tahun Masuk</h4>
                                                {chartData.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="tahun" />
                                                            <YAxis allowDecimals={false} />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="Jumlah Santri" fill="#10B981" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : <p className="text-sm text-gray-500">Data chart tidak tersedia.</p>}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col justify-center items-center h-full text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 6l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 0v6m6-6v10" />
                                                </svg>
                                                <p className="font-semibold">Klik pada provinsi di peta</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">untuk melihat daftar santri dan statistik tahun masuk.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
