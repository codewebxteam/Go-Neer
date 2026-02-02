import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, ShoppingCart, Loader2, Check, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { getVendors } from '../../services/vendorService'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart()
    
    const [product, setProduct] = useState(null)
    const [vendor, setVendor] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const initializeProduct = async () => {
            try {
                setLoading(true)
                
                // Try to get from location state first
                if (location.state?.product) {
                    setProduct(location.state.product)
                    setVendor(location.state.vendor)
                    return
                }

                // Otherwise fetch from mock data
                const foundProduct = MOCK_PRODUCTS.find(p => p.id === id)
                if (foundProduct) {
                    setProduct(foundProduct)
                    
                    // Get vendor info
                    try {
                        const vendors = await getVendors()
                        const foundVendor = vendors?.find(v => v.id === foundProduct.vendor_id)
                        setVendor(foundVendor || MOCK_VENDORS.find(v => v.id === foundProduct.vendor_id))
                    } catch (error) {
                        const foundVendor = MOCK_VENDORS.find(v => v.id === foundProduct.vendor_id)
                        setVendor(foundVendor)
                    }
                }
            } catch (error) {
                console.error('Error loading product:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeProduct()
    }, [id, location.state])

    const isInCart = cartItems.some(item => item.id === product?.id)
    const cartItem = cartItems.find(item => item.id === product?.id)

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                ...product,
                quantity: quantity
            })
            setAdded(true)
            setTimeout(() => setAdded(false), 2000)
            setQuantity(1)
        }
    }

    const handleUpdateQuantity = (newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(product.id, newQuantity)
        }
    }

    const handleRemoveFromCart = () => {
        removeFromCart(product.id)
    }


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-600 hover:text-blue-600 mb-8 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg p-8 flex items-center justify-center"
                    >
                        <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-96 object-contain"
                        />
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Product Name */}
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-3">
                                {product.name}
                            </h1>
                            <p className="text-lg text-slate-600">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                            <p className="text-slate-600 text-sm mb-1">Price</p>
                            <p className="text-5xl font-bold text-blue-600">
                                ₹{product.price}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div>
                            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                                product.stock > 0 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Vendor Information */}
                        {vendor && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4">Sold By</h3>
                                <div className="flex items-start gap-4">
                                    {vendor.image_url && (
                                        <img 
                                            src={vendor.image_url}
                                            alt={vendor.shop_name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-900 text-lg">
                                            {vendor.shop_name}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-semibold text-slate-700">
                                                {vendor.rating || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{vendor.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector and Add to Cart */}
                        <div className="space-y-4">
                            {isInCart ? (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                    <p className="text-sm font-semibold text-slate-600 mb-3">
                                        Quantity in Cart
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Minus className="w-5 h-5 text-slate-600" />
                                        </button>
                                        <span className="text-xl font-bold text-slate-900 w-12 text-center">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-5 h-5 text-slate-600" />
                                        </button>
                                        <button
                                            onClick={handleRemoveFromCart}
                                            className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                    <p className="text-sm font-semibold text-slate-600 mb-3">
                                        Quantity
                                    </p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Minus className="w-5 h-5 text-slate-600" />
                                        </button>
                                        <span className="text-xl font-bold text-slate-900 w-12 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-5 h-5 text-slate-600" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {isInCart ? (
                                    <Link
                                        to="/cart"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        Go to Cart
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {added ? (
                                            <>
                                                <Check className="w-6 h-6" />
                                                Added to Cart!
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-6 h-6" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                )}

                                <Link
                                    to="/checkout"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
                                >
                                    Buy Now
                                </Link>
                            </div>
                        </div>

                        {/* Features/Benefits */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4">Why Choose This Product?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Verified and tested quality
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Nearest vendor available
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Fast delivery within 30 minutes
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Secure checkout and payment
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
