import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Komponen InfoBox
const InfoBox = ({ title, data, onClose }) => (
    <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        </div>
        <ul>
            {data.map(santri => (
                <li key={santri.id} className="border-b dark:border-gray-700 py-2">
                    <Link href={route('santris.show', santri.id)} className="text-teal-600 dark:text-teal-400 hover:underline">
                        {santri.nama_santri} <span className="text-sm text-gray-500">({santri.kabupaten})</span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default function SantriMap({ auth, santriByProvince = [], allSantriDetails = [] }) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);

    // URL GeoJSON Indonesia per provinsi
const geoJsonUrl = 'https://raw.githubusercontent.com/aziznaufal/indonesia-geojson/master/indonesia-province.json';

    useEffect(() => {
        fetch(geoJsonUrl)
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Gagal memuat GeoJSON:", err));
    }, []);

    // Map provinsi -> total santri
    const santriByProvinceMap = new Map(
        santriByProvince.map(item => [item.provinsi.toLowerCase(), item.total])
    );

    const maxSantri = Math.max(...santriByProvince.map(item => item.total), 0);

    const getColor = (count) => {
        if (!count || count === 0) return '#FFFFFF';
        const intensity = Math.log(count + 1) / Math.log(maxSantri + 1);
        const green = 200 - Math.floor(150 * intensity);
        return `rgb(0, ${green}, 0)`;
    };

    const style = (feature) => {
        const provinceName = feature.properties.Propinsi?.toLowerCase();
        const count = santriByProvinceMap.get(provinceName) || 0;
        return {
            fillColor: getColor(count),
            weight: 1,
            opacity: 1,
            color: 'grey',
            fillOpacity: 0.7,
        };
    };

    const onEachFeature = (feature, layer) => {
        const provinceName = feature.properties.Propinsi;
        const count = santriByProvinceMap.get(provinceName?.toLowerCase()) || 0;
        layer.bindTooltip(`${provinceName}: ${count} santri`);

        layer.on({
            click: () => {
                const santriInProvince = allSantriDetails.filter(
                    s => s.provinsi && s.provinsi.toLowerCase() === provinceName.toLowerCase()
                );
                setSelectedProvince({ name: provinceName, santri: santriInProvince });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth?.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Peta Sebaran Santri</h2>}>
            <Head title="Peta Sebaran Santri" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 relative h-[80vh] w-full">
                            {!geoJsonData && <p>Memuat data peta...</p>}
                            {geoJsonData && (
                                <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />
                                </MapContainer>
                            )}
                            {selectedProvince && (
                                <InfoBox title={`Santri dari ${selectedProvince.name}`} data={selectedProvince.santri} onClose={() => setSelectedProvince(null)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}