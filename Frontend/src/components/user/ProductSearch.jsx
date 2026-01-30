import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../../data/mockData'

export default function ProductSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [hasSearched, setHasSearched] = useState(true)

    // Get user's current location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation({ latitude, longitude })
                },
                (error) => {
                    console.log('Location access not available:', error.message)
                }
            )
        }
    }, [])

    // Load products from mock data and show all by default
    useEffect(() => {
        setProducts(MOCK_PRODUCTS)
        // Show all demo products by default
        const enrichedProducts = MOCK_PRODUCTS.map(product => {
            const vendor = MOCK_VENDORS.find(v => v.id === product.vendorId)
            let distance = 999999

            if (userLocation && vendor) {
                distance = parseFloat(
                    calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        vendor.latitude,
                        vendor.longitude
                    )
                )
            } else if (vendor) {
                distance = vendor.distance || Math.random() * 10
            }

            return {
                ...product,
                vendor: vendor || {},
                distance: distance
            }
        })

        enrichedProducts.sort((a, b) => a.distance - b.distance)
        setFilteredProducts(enrichedProducts)
    }, [])

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return (R * c).toFixed(1)
    }

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase().trim()
        setSearchQuery(value)
        setHasSearched(true)

        if (!value) {
            setFilteredProducts([])
            return
        }

        // Filter products by name or description
        const filtered = products.filter(product => {
            const name = product.name?.toLowerCase() || ''
            const description = product.description?.toLowerCase() || ''
            return name.includes(value) || description.includes(value)
        })

        // Enrich with vendor info and calculate distance
        const enrichedProducts = filtered.map(product => {
            const vendor = MOCK_VENDORS.find(v => v.id === product.vendorId)
            let distance = 999999

            if (userLocation && vendor) {
                distance = parseFloat(
                    calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        vendor.latitude,
                        vendor.longitude
                    )
                )
            } else if (vendor) {
                // Use mock distance if location not available
                distance = vendor.distance || Math.random() * 10
            }

            return {
                ...product,
                vendor: vendor || {},
                distance: distance
            }
        })

        // Sort by distance (ascending - nearest first)
        enrichedProducts.sort((a, b) => a.distance - b.distance)
        setFilteredProducts(enrichedProducts)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] pb-20 bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Find Water Products</h1>
                    <p className="text-lg text-slate-600 mb-8">Search by product name and discover the nearest available sellers</p>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products (e.g., water bottle, purifier, 20L jar...)"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-12 pr-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-lg"
                        />
                    </div>
                </div>
                {/* No Search State */}
                {!hasSearched && (
                    <div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-slate-600 mb-3">Start searching for products</h2>
                        <p className="text-slate-500">Enter a product name above to see available items from nearby sellers</p>
                    </div>
                )}

                {/* No Results State */}
                {hasSearched && filteredProducts.length === 0 && (
                    <div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-slate-600 mb-3">No products found</h2>
                        <p className="text-slate-500">Try searching for different keywords like "20L", "bottle", or "purifier"</p>
                    </div>
                )}

                {/* Results Grid */}
                {filteredProducts.length > 0 && (
                    <div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                variants={itemVariants}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-slate-100 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {product.stock > 0 ? (
                                        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    {/* Product Name */}
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                                        {product.description}
                                    </p>

                                    {/* Vendor Info */}
                                    {product.vendor && (
                                        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-slate-900 text-sm">
                                                    {product.vendor.shop_name || 'Seller'}
                                                </h4>
                                                {product.vendor.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-semibold text-slate-900">
                                                            {product.vendor.rating}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{product.distance} km away</span>
                                            </div>
                                            {product.vendor.delivery_time && (
                                                <p className="text-xs text-slate-600 mt-1">
                                                    📦 {product.vendor.delivery_time}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Price and Action */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                        <div>
                                            <p className="text-xs text-slate-600">Price</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                ₹{product.price}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {filteredProducts.length > 0 && (
                    <div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center text-slate-600"
                    >
                        <p>Found <span className="font-bold text-slate-900">{filteredProducts.length}</span> product(s) matching "{searchQuery}"</p>
                        <p className="text-sm mt-2">Sorted by distance from your location</p>
                    </div>
                )}
            </div>
        </div>
    )
}
