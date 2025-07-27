import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiSearch } from 'react-icons/fi';

// Komponen Input (tidak ada perubahan)
const Input = ({ label, name, value, onChange, error, as = 'input', children, ...props }) => {
    const Tag = as;
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="mt-1 relative">
                <Tag
                    id={name} name={name} value={value || ''} onChange={onChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm pr-10"
                    {...props}
                />
                {children}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};

// Fix ikon default Leaflet (tidak ada perubahan)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Komponen untuk mengubah view peta, sekarang hanya untuk perpindahan besar (search)
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center && center.length === 2) {
            map.flyTo(center, zoom); // Gunakan flyTo untuk animasi yang lebih mulus
        }
    }, [center, zoom, map]);

    return null;
}

// Komponen Marker Draggable (tidak ada perubahan)
function DraggableMarker({ position, onPositionChange, onAddressFound, setLoading }) {
    const markerRef = useRef(null);
    const map = useMap();

    const eventHandlers = useMemo(() => ({
        async dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                setLoading(true);
                const { lat, lng } = marker.getLatLng();
                onPositionChange(marker.getLatLng());

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json();
                    if (data && data.address) {
                        onAddressFound(data.address, data.display_name);
                    }
                } catch (error) { console.error("Gagal melakukan reverse geocoding:", error); }
                finally { setLoading(false); }
            }
        },
    }), [onPositionChange, onAddressFound, setLoading]);

    useMapEvents({
        click(e) {
            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
                map.panTo(e.latlng);
            }
            eventHandlers.dragend();
        },
    });

    return (
        <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
            <Popup>Geser pin ini untuk menentukan lokasi yang presisi.</Popup>
        </Marker>
    );
}

export default function AddressInfoForm({ data, setData, errors, onPositionChange }) {
    const handleInputChange = (e) => setData(e.target.name, e.target.value);

    const [loading, setLoading] = useState(false);
    const initialPosition = data.latitude && data.longitude ? [data.latitude, data.longitude] : [-2.5489, 118.0149];
    const initialZoom = data.latitude && data.longitude ? 17 : 5;
    
    // State ini hanya untuk memicu perpindahan besar saat pencarian
    const [view, setView] = useState({ center: initialPosition, zoom: initialZoom });

    // State untuk posisi pin saja
    const [markerPosition, setMarkerPosition] = useState(initialPosition);

    const handlePositionUpdate = useCallback((latlng) => {
        const newPos = [latlng.lat, latlng.lng];
        setMarkerPosition(newPos);
        onPositionChange({ lat: latlng.lat, lng: latlng.lng });
    }, [onPositionChange]);

    const handleAddressSearch = async () => {
        if (!data.alamat) return;
        setLoading(true);
        const query = `${data.alamat}, Indonesia`;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
            const results = await response.json();
            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
                
                // Perbarui posisi pin dan perintahkan peta untuk terbang ke sana
                handlePositionUpdate(newPosition);
                setView({ center: [newPosition.lat, newPosition.lng], zoom: 17 });
                
                // Panggil juga reverse geocoding agar form terisi
                const reverseResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const reverseData = await reverseResponse.json();
                if (reverseData && reverseData.address) {
                    handleAddressFound(reverseData.address, reverseData.display_name);
                }
            } else {
                alert("Alamat tidak ditemukan.");
            }
        } catch (error) { alert("Gagal mencari alamat."); }
        finally { setLoading(false); }
    };

    const handleAddressFound = (address, displayName) => {
        setData(prevData => ({
            ...prevData,
            alamat: displayName || prevData.alamat,
            kelurahan: address.village || address.suburb || '',
            kecamatan: address.city_district || address.town || '',
            kabupaten: address.county || address.city || '',
            provinsi: address.state || '',
            kode_pos: address.postcode || '',
        }));
    };

    return (
        <div className="space-y-6">
            {/* ... Bagian input form Anda (tidak ada perubahan) ... */}
            <Input label="Alamat Lengkap" name="alamat" value={data.alamat} onChange={handleInputChange} error={errors.alamat} as="textarea" rows={3}>
                <button type="button" onClick={handleAddressSearch} disabled={loading} className="absolute top-0 right-0 mt-2 mr-3 text-gray-500 hover:text-teal-600 disabled:opacity-50" title="Cari Alamat di Peta">
                    {loading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <FiSearch className="h-5 w-5" />}
                </button>
            </Input>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Kelurahan/Desa" name="kelurahan" value={data.kelurahan} onChange={handleInputChange} error={errors.kelurahan} />
                <Input label="Kecamatan" name="kecamatan" value={data.kecamatan} onChange={handleInputChange} error={errors.kecamatan} />
                <Input label="Kabupaten/Kota" name="kabupaten" value={data.kabupaten} onChange={handleInputChange} error={errors.kabupaten} />
                <Input label="Provinsi" name="provinsi" value={data.provinsi} onChange={handleInputChange} error={errors.provinsi} />
                <Input label="Kode Pos" name="kode_pos" value={data.kode_pos} onChange={handleInputChange} error={errors.kode_pos} />
            </div>

            <div className="mt-6">
                <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                    Tandai Lokasi Rumah (Klik atau geser pin pada peta)
                </label>
                <div className="mt-2 rounded-lg overflow-hidden shadow-lg border dark:border-gray-600" style={{ height: '400px' }}>
                    <MapContainer
                        // PEMBARUAN: Hapus 'key' dan gunakan state awal untuk center dan zoom
                        center={initialPosition}
                        zoom={initialZoom}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <DraggableMarker
                            position={markerPosition}
                            onPositionChange={handlePositionUpdate}
                            onAddressFound={handleAddressFound}
                            setLoading={setLoading}
                        />
                        {/* Komponen ini sekarang hanya aktif saat pencarian */}
                        <ChangeView center={view.center} zoom={view.zoom} />
                    </MapContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Latitude" name="latitude" value={data.latitude} readOnly className="bg-gray-100 dark:bg-gray-800" />
                <Input label="Longitude" name="longitude" value={data.longitude} readOnly className="bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
}