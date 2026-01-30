import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Truck, Package, ShoppingCart, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

export default function ProductDetail() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [vendor, setVendor] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [userLocation, setUserLocation] = useState(null)

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation({ latitude, longitude })
                },
                (error) => {
                    console.log('Location access not available')
                }
            )
        }
    }, [])

    // Load product and vendor data
    useEffect(() => {
        const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId)
        if (foundProduct) {
            setProduct(foundProduct)
            const foundVendor = MOCK_VENDORS.find(v => v.id === foundProduct.vendorId)
            setVendor(foundVendor)
        }
        setLoading(false)
    }, [productId])

    // Calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return (R * c).toFixed(1)
    }

    const distance = userLocation && vendor ? 
        calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            vendor.latitude,
            vendor.longitude
        ) : vendor?.distance

    const handleAddToCart = () => {
        if (!product) return
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            vendorId: product.vendorId,
            vendorName: vendor?.shop_name
        })
        
        toast.success(`${product.name} added to cart!`)
        setQuantity(1)
    }

    const handleQuantityChange = (change) => {
        const newQty = quantity + change
        if (newQty >= 1 && newQty <= (product?.stock || 1)) {
            setQuantity(newQty)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
                    <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10">
                        {/* Product Image */}
                        <div
                            className="lg:col-span-1"
                        >
                            <div className="relative bg-slate-100 rounded-xl overflow-hidden h-80 md:h-96 flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.stock > 0 ? (
                                    <span className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div
                            className="lg:col-span-2"
                        >
                            {/* Title and Rating */}
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < Math.floor(vendor?.rating || 4.5)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-slate-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {vendor?.rating || 4.5}
                                        </span>
                                    </div>
                                    <span className="text-slate-600">
                                        ({product.stock > 0 ? product.stock : 0} available)
                                    </span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mb-8 pb-8 border-b-2 border-slate-200">
                                <p className="text-slate-600 text-sm mb-2">Price per unit</p>
                                <p className="text-4xl font-bold text-blue-600 mb-4">
                                    ₹{product.price}
                                </p>
                                <p className="text-sm text-slate-600">
                                    Total: <span className="font-bold text-slate-900">₹{product.price * quantity}</span>
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mb-8 pb-8 border-b-2 border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">About This Product</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    {product.description}
                                </p>
                            </div>

                            {/* Key Details */}
                            <div className="mb-8 pb-8 border-b-2 border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Availability</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Quantity Unit</p>
                                        <p className="text-lg font-semibold text-slate-900">1 Unit</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Info */}
                            {vendor && (
                                <div className="mb-8 pb-8 border-b-2 border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Sold By</h3>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                                        <h4 className="text-xl font-bold text-slate-900 mb-3">
                                            {vendor.shop_name}
                                        </h4>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-slate-600">Location</p>
                                                    <p className="font-semibold text-slate-900">{vendor.address}</p>
                                                    <p className="text-sm text-blue-600 font-semibold">{distance} km away</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-slate-600">Delivery Time</p>
                                                    <p className="font-semibold text-slate-900">{vendor.delivery_time}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-slate-600">Seller Rating</p>
                                                    <p className="font-semibold text-slate-900">
                                                        {vendor.rating} ⭐ | {vendor.is_open ? '🟢 Open' : '🔴 Closed'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector and Add to Cart */}
                            {product.stock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-slate-900">Quantity:</p>
                                        <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="px-4 py-2 text-slate-900 font-bold hover:bg-slate-100 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="px-6 py-2 font-bold text-slate-900 border-l-2 border-r-2 border-slate-200">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                className="px-4 py-2 text-slate-900 font-bold hover:bg-slate-100 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Call
                                        </button>
                                    </div>
                                </div>
                            )}

                            {product.stock === 0 && (
                                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                                    <p className="text-red-600 font-semibold">Out of Stock</p>
                                    <p className="text-sm text-red-500 mt-1">This product is currently unavailable</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
