import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_VENDORS, MOCK_PRODUCTS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { ArrowLeft, Star, Clock, MapPin, Plus, ShoppingCart, Check, X, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VendorMenu() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, cartItems, updateQuantity, totalAmount, removeFromCart } = useCart()
    const [vendor, setVendor] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCartPanel, setShowCartPanel] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            // Simulate Fetch
            await new Promise(resolve => setTimeout(resolve, 500))

            const foundVendor = MOCK_VENDORS.find(v => v.id === id)
            if (foundVendor) {
                setVendor(foundVendor)
                // Filter products for this vendor (or shared ones for demo)
                const vendorProducts = MOCK_PRODUCTS.filter(p => p.vendor_id === id || p.vendor_id === 'vendor-1')
                setProducts(vendorProducts)
            }
            setLoading(false)
        }

        if (id) fetchData()
    }, [id, navigate])

    // Automatically open cart panel when items are added if not already open
    const handleAddToCart = (product) => {
        addToCart(product)
        setShowCartPanel(true)
    }

    const isProductInCart = (productId) => {
        return cartItems.some(item => item.id === productId)
    }

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>
    if (!vendor) return <div className="h-screen flex items-center justify-center">Vendor not found</div>

    return (
        <div className="min-h-screen bg-slate-50 pb-20 relative">
            {/* Vendor Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{vendor.shop_name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                    {vendor.address || "Address not provided"}
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-700">{vendor.rating || "New"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-slate-400" />
                                    15-30 min delivery
                                </div>
                            </div>
                        </div>

                        <div className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full font-bold ${vendor.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {vendor.is_open ? 'Open Now' : 'Closed'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex container mx-auto px-4 py-8 gap-8 relative">
                {/* Menu Grid - Takes mostly full width but allows space for fixed cart if needed, 
                    though mapped to overlay style as per 'window' ref. 
                */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Menu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => {
                            const added = isProductInCart(product.id)
                            return (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col">
                                    <div className="h-48 overflow-hidden">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                                                <span className="font-bold text-slate-900">₹{product.price}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                        </div>

                                        <button
                                            onClick={() => added ? navigate('/cart') : handleAddToCart(product)}
                                            className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center ${added
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                }`}
                                        >
                                            {added ? (
                                                <>
                                                    Go to Cart <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-5 h-5 mr-2" /> Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Side Cart Window */}
                <AnimatePresence>
                    {showCartPanel && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-4 top-24 bottom-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 flex flex-col overflow-hidden"
                            style={{ maxHeight: 'calc(100vh - 8rem)' }}
                        >
                            {/* Header */}
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center">
                                    <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                                    Your Cart ({cartItems.length})
                                </h3>
                                <button onClick={() => setShowCartPanel(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ShoppingCart className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p>Your cart is empty</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                                            <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="font-bold text-blue-600">₹{item.price * item.quantity}</div>
                                                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-slate-50 text-slate-600"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-slate-50 text-blue-600"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer / Total */}
                            {cartItems.length > 0 && (
                                <div className="p-4 bg-slate-50 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-600">Total Amount</span>
                                        <span className="text-xl font-bold text-slate-900">₹{totalAmount}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
                                    >
                                        View Cart & Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
