import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MOCK_ORDERS } from '../../data/mockData'
import { Package, Clock, MapPin, ChevronRight, CheckCircle, XCircle, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            // Simulate Fetch
            await new Promise(resolve => setTimeout(resolve, 600))

            // In mock data, filter by user id, or show all for demo if user matches 'user-1'
            // For this seamless migration, let's just show all orders that "match" the user ID 
            // OR if it's our first demo user.

            const myOrders = MOCK_ORDERS.filter(o => o.user_id === user.id || o.user_id === 'user-1') // 'user-1' is the seed user id
            setOrders(myOrders)
            setLoading(false)
        }

        if (user) fetchOrders()
    }, [user])

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'accepted': return 'bg-blue-100 text-blue-700'
            case 'delivering': return 'bg-purple-100 text-purple-700'
            case 'delivered': return 'bg-green-100 text-green-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 mr-1" />
            case 'accepted': return <CheckCircle className="w-4 h-4 mr-1" />
            case 'delivering': return <Truck className="w-4 h-4 mr-1" />
            case 'delivered': return <CheckCircle className="w-4 h-4 mr-1" />
            case 'cancelled': return <XCircle className="w-4 h-4 mr-1" />
            default: return <Clock className="w-4 h-4 mr-1" />
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center py-12">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700">No past orders</h2>
                        <p className="text-slate-500 mb-6">You haven't ordered any water yet.</p>
                        <Link to="/" className="text-blue-600 font-bold hover:underline">Browse Vendors</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center w-fit ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                            <span className="text-slate-400 text-sm">#{order.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">{order.vendors?.shop_name || 'Unknown Vendor'}</h3>
                                        <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-slate-900">₹{order.total_amount}</span>
                                        <span className="text-xs text-slate-400">Total Amount</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50/50">
                                    <div className="space-y-3">
                                        {order.order_items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 overflow-hidden mr-3">
                                                        <img src={item.products?.image_url} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-medium text-slate-700">
                                                        {item.products?.name} <span className="text-slate-400">x{item.quantity}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
