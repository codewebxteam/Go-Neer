import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Star, Clock, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

export default function VendorMap({ vendors, userLocation }) {
    // Default center (Delhi)
    const mapCenter = userLocation 
        ? [userLocation.latitude, userLocation.longitude]
        : [28.6139, 77.2090]

    // Custom marker icon in blue (vendor color)
    const vendorIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    // User location marker
    const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    return (
        <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={userIcon}
                    >
                        <Popup>
                            <div className="font-semibold text-slate-800">Your Location</div>
                        </Popup>
                    </Marker>
                )}

                {/* Vendor Markers */}
                {vendors.map((vendor) => (
                    <Marker
                        key={vendor.id}
                        position={[vendor.latitude, vendor.longitude]}
                        icon={vendorIcon}
                    >
                        <Popup>
                            <div className="min-w-64">
                                {/* Vendor Image */}
                                <div className="h-32 -mx-2 -mt-2 mb-3 rounded-t-lg overflow-hidden">
                                    <img
                                        src={vendor.image_url}
                                        alt={vendor.shop_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Vendor Info */}
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                                        {vendor.shop_name}
                                    </h3>

                                    {/* Address */}
                                    <div className="flex items-start gap-2 mb-3 text-slate-600 text-sm">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                                        <span>{vendor.address}</span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500 text-sm">★</span>
                                            <span className="font-bold text-slate-800">{vendor.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {vendor.delivery_time}
                                        </div>
                                    </div>

                                    {/* Distance and Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500">Distance</span>
                                            <span className="font-semibold text-slate-800">{vendor.distance} km</span>
                                        </div>
                                        <div>
                                            {vendor.is_open ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                                    Open Now
                                                </span>
                                            ) : (
                                                <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-full">
                                                    Closed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
