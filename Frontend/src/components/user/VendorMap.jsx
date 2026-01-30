import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default marker icon issue (MANDATORY)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function VendorMap({ vendors = [], userLocation = null }) {
    // 🔒 HARD VALIDATION (THIS SAVES YOU)
    const safeVendors = vendors
        .map((v) => ({
            ...v,
            latitude: Number(v.latitude),
            longitude: Number(v.longitude),
        }))
        .filter(
            (v) =>
                Number.isFinite(v.latitude) &&
                Number.isFinite(v.longitude)
        )

    const hasUserLocation =
        userLocation &&
        Number.isFinite(userLocation.latitude) &&
        Number.isFinite(userLocation.longitude)

    // 🌍 Fallback center (India center)
    const center = hasUserLocation
        ? [userLocation.latitude, userLocation.longitude]
        : safeVendors.length > 0
            ? [safeVendors[0].latitude, safeVendors[0].longitude]
            : [22.9734, 78.6569]

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full rounded-xl"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🧍 USER LOCATION */}
            {hasUserLocation && (
                <Marker
                    position={[
                        userLocation.latitude,
                        userLocation.longitude,
                    ]}
                >
                    <Popup>You are here</Popup>
                </Marker>
            )}

            {/* 🏪 VENDORS */}
            {safeVendors.map((vendor) => (
                <Marker
                    key={vendor.id}
                    position={[vendor.latitude, vendor.longitude]}
                >
                    <Popup>
                        <div className="space-y-1">
                            <p className="font-bold">
                                {vendor.shopName || "Vendor"}
                            </p>
                            {vendor.address && (
                                <p className="text-sm text-gray-500">
                                    {vendor.address}
                                </p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
