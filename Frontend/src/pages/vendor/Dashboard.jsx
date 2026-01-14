import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_VENDORS } from '../../data/mockData'
import { Plus, Package, ShoppingBag, Trash2, Edit, Check, X, Truck, TrendingUp, AlertCircle, Target, BarChart3, Users, DollarSign, Star } from 'lucide-react'
import AddProductModal from '../../components/vendor/AddProductModal'
import { toast } from 'react-toastify'

export default function VendorDashboard() {
    const navigate = useNavigate()
    const { profile, user } = useAuth()
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [suggestions, setSuggestions] = useState([])

    // Helper to filter mock data for current vendor
    // In real app, we query by vendor_id. Here we simulating seeing our own data.
    // For demo, we just show all products/orders or filter by ID if we set one matching.
    const loadData = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 600))

        // In our mock data, we assigned 'vendor-1' to products
        // If current user is 'vendor-1', show those. Otherwise show empty or demo data for others.
        // For simplicity in this demo, we'll show EVERYTHING if the user is a vendor, 
        // or filter if we want strictness. Let's show filtered.

        const myProducts = MOCK_PRODUCTS.filter(p => p.vendor_id === user?.id || p.vendor_id === 'vendor-1')
        // ^ Allow 'vendor-1' data to be visible to anyone for demo purposes if they switch accounts

        setProducts(myProducts)
        setOrders(MOCK_ORDERS) // Show all demo orders
        
        // Generate smart suggestions
        generateSuggestions(myProducts, MOCK_ORDERS)
        setIsLoading(false)
    }

    // Generate intelligent suggestions for vendor dashboard
    const generateSuggestions = (prods, ords) => {
        const suggestionsList = []
        
        // Suggestion 1: Low stock products
        const lowStockProducts = prods.filter(p => p.stock < 10)
        if (lowStockProducts.length > 0) {
            suggestionsList.push({
                id: 'low-stock',
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${lowStockProducts.length} product(s) have low stock levels. Reorder soon to avoid missing sales.`,
                icon: AlertCircle,
                action: 'Reorder Products',
                color: 'amber'
            })
        }

        // Suggestion 2: Popular products insight
        if (prods.length > 0) {
            const topProduct = prods.reduce((prev, current) => 
                (prev.stock > current.stock) ? prev : current
            )
            suggestionsList.push({
                id: 'popular-product',
                type: 'info',
                title: 'Popular Item',
                message: `"${topProduct.name}" is your most stocked product. Consider promoting it on social media!`,
                icon: TrendingUp,
                action: 'Promote',
                color: 'blue'
            })
        }

        // Suggestion 3: Increase product variety
        if (prods.length < 5) {
            suggestionsList.push({
                id: 'add-products',
                type: 'tip',
                title: 'Add More Products',
                message: `You have ${prods.length} product(s). Adding 5+ products can increase your sales by 40%. Start with complementary items!`,
                icon: Target,
                action: 'Add Product',
                color: 'green'
            })
        }

        // Suggestion 4: Pending orders
        const pendingOrders = ords.filter(o => o.status === 'pending' || o.status === 'Pending')
        if (pendingOrders.length > 0) {
            suggestionsList.push({
                id: 'pending-orders',
                type: 'urgent',
                title: 'Pending Orders',
                message: `You have ${pendingOrders.length} pending order(s). Accept them quickly to improve your rating!`,
                icon: Truck,
                action: 'View Orders',
                color: 'red'
            })
        }

        setSuggestions(suggestionsList)
    }

    useEffect(() => {
        if (user) {
            loadData()
        }
    }, [user])

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        // Simulate delete
        setProducts(products.filter(p => p.id !== id))
        toast.success("Product deleted")
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        // Simulate update
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        toast.success(`Order ${newStatus}`)
    }

    const handleProductAdded = (newProduct) => {
        // This is called by Modal
        // We add to local state
        setProducts([newProduct, ...products])
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Vendor Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {profile?.full_name}</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                </button>
            </div>

            {/* Smart Suggestions Section */}
            {suggestions.length > 0 && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {suggestions.map((suggestion) => {
                        const Icon = suggestion.icon
                        const colorClasses = {
                            blue: 'bg-blue-50 border-blue-200 text-blue-700',
                            green: 'bg-green-50 border-green-200 text-green-700',
                            amber: 'bg-amber-50 border-amber-200 text-amber-700',
                            red: 'bg-red-50 border-red-200 text-red-700',
                            indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        }
                        const buttonColorClasses = {
                            blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
                            green: 'bg-green-100 hover:bg-green-200 text-green-700',
                            amber: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
                            red: 'bg-red-100 hover:bg-red-200 text-red-700',
                            indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                        }
                        
                        return (
                            <div key={suggestion.id} className={`${colorClasses[suggestion.color]} border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
                                <div className="flex items-start gap-3 mb-3">
                                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                                        <p className="text-xs leading-relaxed opacity-90">{suggestion.message}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (suggestion.id === 'add-products' || suggestion.id === 'low-stock') {
                                            setIsAddModalOpen(true)
                                        } else if (suggestion.id === 'pending-orders') {
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }
                                        toast.info(`${suggestion.action} clicked`)
                                    }}
                                    className={`${buttonColorClasses[suggestion.color]} w-full py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer hover:opacity-80`}
                                >
                                    {suggestion.action}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium text-sm sm:text-base">Total Products</h3>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">{products.length}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium text-sm sm:text-base">Total Orders</h3>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">{orders.length}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium text-sm sm:text-base">Revenue</h3>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">₹{orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium text-sm sm:text-base">Rating</h3>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">4.5★</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                {/* Orders Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2" /> Recent Orders
                    </h2>

                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="bg-slate-50 p-8 rounded-xl text-center text-slate-500 border border-slate-200 border-dashed">
                                No orders received yet.
                            </div>
                        ) : orders.map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold text-slate-800">{order.profiles?.full_name}</span>
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{order.profiles?.phone_number}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
                                        <p className="text-sm mt-2 font-medium text-slate-600">{order.delivery_address}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">₹{order.total_amount}</div>
                                        <span className={`text-xs font-bold uppercase ${order.status === 'pending' ? 'text-yellow-600' :
                                            order.status === 'accepted' ? 'text-blue-600' :
                                                order.status === 'delivering' ? 'text-purple-600' :
                                                    order.status === 'delivered' ? 'text-green-600' : 'text-slate-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm space-y-1">
                                    {order.order_items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>{item.products?.name} x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 mr-1" /> Accept
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4 mr-1" /> Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'accepted' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'delivering')}
                                            className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg font-bold text-sm hover:bg-purple-200 transition-colors flex items-center justify-center"
                                        >
                                            <Truck className="w-4 h-4 mr-1" /> Start Delivery
                                        </button>
                                    )}
                                    {order.status === 'delivering' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4 mr-1" /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Package className="w-5 h-5 mr-2" /> Your Products
                    </h2>

                    {isLoading ? (
                        <div className="text-center py-12 text-slate-400">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600">No products added yet</h3>
                            <p className="text-slate-400 mb-6">Start selling by adding your first water product.</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Add Product Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all">
                                    <div className="h-32 overflow-hidden relative">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    navigate(`/vendor/product/${product.id}`)
                                                    toast.info('Opening product editor')
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur rounded-full text-blue-600 hover:text-blue-700 shadow-sm hover:scale-110 transition-transform"
                                                title="Edit product"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:text-red-700 shadow-sm hover:scale-110 transition-transform"
                                                title="Delete product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 text-base">{product.name}</h3>
                                            <span className="font-bold text-green-600">₹{product.price}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-slate-400">
                                            <span>Stock: {product.stock}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.is_available ? 'AVL' : 'OUT'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={handleProductAdded}
            />
        </div>
    )
}
