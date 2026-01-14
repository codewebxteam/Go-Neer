import { useCart } from '../../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart()
    const navigate = useNavigate()
    const [recentlyAdded, setRecentlyAdded] = useState([])

    useEffect(() => {
        // Get the 3 most recently added items
        const sortedByRecent = [...cartItems].slice(-3).reverse()
        setRecentlyAdded(sortedByRecent)
    }, [cartItems])

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-slate-500 mb-8">Looks like you haven't added any products yet.</p>
                    <Link
                        to="/"
                        className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                    <ShoppingBag className="w-8 h-8 mr-3 text-blue-600" /> My Cart
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Recently Added Section */}
                        {recentlyAdded.length > 0 && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                                <div className="flex items-center mb-3">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    <h2 className="text-lg font-bold text-slate-800">Recently Added</h2>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {recentlyAdded.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm min-w-[280px] border border-blue-100">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                                                <p className="text-slate-500 text-xs">₹{item.price} × {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-blue-600 text-sm">₹{item.price * item.quantity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Cart Items */}
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center animate-in slide-in-from-bottom-2 duration-300">
                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="ml-6 flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4">₹{item.price} per unit</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3 bg-slate-100 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-blue-600 active:scale-95 transition-all"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-blue-600 active:scale-95 transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-slate-900 text-lg">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl text-slate-900">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center"
                            >
                                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
