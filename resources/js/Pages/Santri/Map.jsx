import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // <-- Import cluster

// Import CSS untuk leaflet dan marker cluster
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';

// Fix ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function SantriMap({ auth, santris = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Peta Sebaran Santri" />
            <div className="py-8">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Peta Sebaran Peserta Didik
                    </h2>
                    <div className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800" style={{ height: 'calc(100vh - 12rem)' }}>
                        <MapContainer
                            center={[-2.5, 118]} // Center of Indonesia
                            zoom={5}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Gunakan MarkerClusterGroup untuk mengelompokkan marker */}
                            <MarkerClusterGroup>
                                {santris.map((santri) => (
                                    <Marker
                                        key={santri.id}
                                        position={[santri.latitude, santri.longitude]}
                                    >
                                        <Popup>
                                            <strong>{santri.nama_santri}</strong><br />
                                            {santri.kabupaten}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MarkerClusterGroup>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}