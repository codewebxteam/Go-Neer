import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import { MOCK_PRODUCTS, MOCK_VENDORS } from '../../data/mockData'
import { getProductById, getProductsByVendor } from '../../services/productService'
import { getVendorById } from '../../services/vendorService'
import { useCart } from '../../context/CartContext'
import { ArrowLeft, Star, Clock, MapPin, Plus, ShoppingCart, Check, X, Minus, Trash2, Droplets } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, cartItems, updateQuantity, totalAmount, removeFromCart } = useCart()
    const [product, setProduct] = useState(null)
    const [vendor, setVendor] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCartPanel, setShowCartPanel] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product by ID
                const productData = await getProductById(id)

                if (productData) {
                    setProduct(productData)

                    // Fetch vendor for this product
                    if (productData.vendor_id) {
                        const vendorData = await getVendorById(productData.vendor_id)
                        setVendor(vendorData)
                    }

                    // Get related products (same vendor or others, for now let's just show products from same vendor)
                    // In a real app we might have a specific endpoint for related products
                    if (productData.vendor_id) {
                        const vendorProducts = await getProductsByVendor(productData.vendor_id)
                        const related = vendorProducts.filter(p => p.id !== id).slice(0, 4)
                        setRelatedProducts(related)
                    }
                } else {
                    console.error("Product not found")
                }
            } catch (error) {
                console.error("Error fetching product details:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchData()
    }, [id, navigate])

    // Handle add to cart
    const handleAddToCart = () => {
        if (product) {
            addToCart(product)
            setShowCartPanel(true)
        }
    }

    const isProductInCart = product ? cartItems.some(item => item.id === product.id) : false

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="text-center"><Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" /><p>Loading...</p></div></div>
    if (!product) return <div className="h-screen flex items-center justify-center"><div className="text-center"><Droplets className="w-12 h-12 text-slate-400 mx-auto mb-4" /><p>Product not found</p></div></div>


    return (
        <div className="min-h-screen bg-slate-50 pb-20 relative">
            {/* Back Button */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
                    </button>
                </div>
            </div>

            <div className="flex container mx-auto px-4 py-8 gap-8 relative">
                {/* Product Details */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 p-8 mb-8">
                        {/* Product Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="mb-4">
                                        <span className="text-blue-600 font-bold uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">Premium Water</span>
                                    </div>
                                    <h1 className="text-4xl font-bold text-slate-900 mb-3">{product.name}</h1>
                                    <p className="text-slate-600 text-lg mb-6">{product.description}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <p className="text-slate-500 text-sm mb-2">Price</p>
                                        <div className="text-5xl font-bold text-blue-600">₹{product.price}</div>
                                    </div>

                                    {/* Vendor Info */}
                                    {vendor && (
                                        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                                            <p className="text-slate-600 text-sm mb-2">Sold By</p>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{vendor.shop_name}</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-slate-700">{vendor.rating || 'New'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>15-30 min delivery</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Features */}
                                    <div className="mb-6">
                                        <h3 className="font-bold text-slate-900 mb-3">Key Features</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-3 text-slate-700">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                100% Pure & Filtered Water
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-700">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                Quality Tested & Certified
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-700">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                Fast Delivery Service
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-700">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                Eco-Friendly Packaging
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddToCart}
                                    className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center text-lg ${isProductInCart
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {isProductInCart ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2" /> Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 mr-2" /> Add to Cart
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-slate-100 pt-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">About This Product</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-slate-600 text-sm mb-2">Type</p>
                                    <p className="font-bold text-slate-900">Mineral Water</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-slate-600 text-sm mb-2">Availability</p>
                                    <p className="font-bold text-slate-900">In Stock</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-slate-600 text-sm mb-2">Delivery</p>
                                    <p className="font-bold text-slate-900">15-30 minutes</p>
                                </div>
                            </div>
                        </div>
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

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(relProduct => (
                                <motion.div
                                    key={relProduct.id}
                                    whileHover={{ y: -10 }}
                                    onClick={() => navigate(`/product/${relProduct.id}`)}
                                    className="bg-slate-50 rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="h-40 overflow-hidden bg-gradient-to-r from-blue-400 to-cyan-300">
                                        <img src={relProduct.image_url} alt={relProduct.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-900 mb-1">{relProduct.name}</h3>
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-1">{relProduct.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-blue-600">₹{relProduct.price}</span>
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">View</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
