import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { MOCK_ORDERS } from '../../data/mockData'
import { toast } from 'react-toastify'
import { MapPin, Loader2, CheckCircle } from 'lucide-react'

export default function Checkout() {
    const { cartItems, totalAmount, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState('')
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)

    if (cartItems.length === 0 && !isOrderPlaced) {
        navigate('/cart')
        return null
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to place an order')
            navigate('/login')
            return
        }

        setLoading(true)

        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        try {
            // Group items by vendor
            const itemsByVendor = cartItems.reduce((acc, item) => {
                if (!acc[item.vendor_id]) acc[item.vendor_id] = []
                acc[item.vendor_id].push(item)
                return acc
            }, {})

            // Create an order for each vendor group
            for (const vendorId of Object.keys(itemsByVendor)) {
                const vendorItems = itemsByVendor[vendorId]
                const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                const newOrder = {
                    id: `ord-${Date.now()}-${vendorId}`,
                    user_id: user.id,
                    vendor_id: vendorId,
                    total_amount: vendorTotal,
                    status: 'pending',
                    delivery_address: address,
                    created_at: new Date().toISOString(),
                    // Mock joined data for display
                    vendors: { shop_name: 'Mock Shop (Demo)' },
                    order_items: vendorItems.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        products: { name: item.name, image_url: item.image_url }
                    }))
                }

                MOCK_ORDERS.unshift(newOrder) // Add to top
            }

            setIsOrderPlaced(true)
            clearCart()
            toast.success('Order placed successfully! (Demo Mode)')

        } catch (error) {
            console.error(error)
            toast.error('Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (isOrderPlaced) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full animate-in zoom-in duration-300 border border-green-100">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
                    <p className="text-slate-500 mb-8">Your water is on its way. You can track it in your orders page.</p>
                    <Link
                        to="/orders"
                        className="block w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        View My Orders
                    </Link>
                    <Link to="/" className="block mt-4 text-slate-500 font-medium hover:text-blue-600">
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Delivery Address
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Address</label>
                                <textarea
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House No, Street, Landmark, City..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                    rows="4"
                                />
                            </div>

                            {/* Payment Method Stub - For now assume COD */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Payment Method</h3>
                                <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-xl flex items-center justify-between cursor-pointer">
                                    <span className="font-bold text-slate-700">Cash / UPI on Delivery</span>
                                    <div className="w-5 h-5 rounded-full border-4 border-blue-500"></div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !address.trim()}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Place Order (₹${totalAmount})`}
                            </button>
                        </form>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Items in Order</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded bg-slate-100 mr-3 overflow-hidden">
                                                <img src={item.image_url} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">{item.name}</p>
                                                <p className="text-slate-400">x{item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-700">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between font-bold text-lg text-slate-900">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
