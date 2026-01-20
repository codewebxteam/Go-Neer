import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { queryDocuments, updateDocument, deleteDocument } from '../../services/firestoreService'
import { Plus, Package, ShoppingBag, Trash2, Edit, Check, X, Truck, TrendingUp, AlertCircle, Target, BarChart3, Users, DollarSign, Star, Eye, Eye as EyeOff, Clock, Loader2 } from 'lucide-react'
import AddProductModal from '../../components/vendor/AddProductModal'
import { toast } from 'react-toastify'

export default function VendorDashboard() {
    const navigate = useNavigate()
    const { profile, user } = useAuth()
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const loadData = async () => {
        try {
            setIsLoading(true)

            // Fetch vendor's products
            const myProducts = await queryDocuments('products', {
                where: ['vendorId', '==', user?.uid]
            })
            setProducts(myProducts)

            // Fetch vendor's orders
            const vendorOrders = await queryDocuments('orders', {
                where: ['vendorId', '==', user?.uid]
            })
            setOrders(vendorOrders)
        } catch (error) {
            console.error('Error loading vendor data:', error)
            toast.error('Failed to load data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user?.uid) {
            loadData()
        }
    }, [user?.uid])

    // Get low stock products
    const getLowStockProducts = () => {
        return products.filter(p => (p.stock || 0) < 10)
    }

    // Get popular products (most ordered)
    const getPopularProducts = () => {
        if (products.length === 0 || orders.length === 0) return []
        
        const productOrderCount = {}
        orders.forEach(order => {
            order.items?.forEach(item => {
                const productId = item.productId || item.id
                productOrderCount[productId] = (productOrderCount[productId] || 0) + (item.quantity || 1)
            })
        })
        
        return products
            .map(p => ({ ...p, orderCount: productOrderCount[p.id] || 0 }))
            .filter(p => p.orderCount > 0)
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, 3)
    }

    // Get pending orders
    const getPendingOrders = () => {
        return orders.filter(o => o.status === 'pending' || o.status === 'Pending')
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteDocument('products', id)
            setProducts(products.filter(p => p.id !== id))
            toast.success("Product deleted successfully")
        } catch (error) {
            console.error('Delete error:', error)
            toast.error("Failed to delete product")
        }
    }

    const toggleProductAvailability = async (id, currentStock) => {
        try {
            const newAvailability = currentStock > 0
            await updateDocument('products', id, { is_available: newAvailability })
            setProducts(products.map(p => p.id === id ? { ...p, is_available: newAvailability } : p))
            toast.success(newAvailability ? "Product marked as in stock" : "Product marked as out of stock")
        } catch (error) {
            console.error('Update error:', error)
            toast.error("Failed to update product")
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateDocument('orders', orderId, { status: newStatus })
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            toast.success(`Order marked as ${newStatus}`)
        } catch (error) {
            console.error('Update error:', error)
            toast.error("Failed to update order status")
        }
    }

    const handleProductAdded = (newProduct) => {
        setProducts([newProduct, ...products])
        toast.success("Product added successfully!")
    }

    const lowStockProducts = getLowStockProducts()
    const popularProducts = getPopularProducts()
    const pendingOrders = getPendingOrders()
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    const totalOrdersCompleted = orders.filter(o => o.status === 'delivered').length

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">Vendor Dashboard</h1>
                        <p className="text-slate-600 text-sm sm:text-base">Welcome back, {profile?.full_name || 'Vendor'}</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center sm:justify-start hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-blue-500/30"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add Product
                    </button>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">Total Products</span>
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-slate-800">{products.length}</p>
                    </div>
                    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">Total Orders</span>
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-slate-800">{orders.length}</p>
                    </div>
                    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">Completed</span>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-slate-800">{totalOrdersCompleted}</p>
                    </div>
                    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">Pending</span>
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-slate-800">{pendingOrders.length}</p>
                    </div>
                    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">Revenue</span>
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        </div>
                        <p className="text-lg sm:text-3xl font-bold text-slate-800">₹{totalRevenue}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Low Stock Products */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-linear-to-r from-amber-50 to-orange-50 px-4 sm:px-6 py-4 border-b border-amber-200">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <h2 className="text-base sm:text-lg font-bold text-amber-900">Low Stock Alert</h2>
                                <span className="ml-auto text-xs sm:text-sm font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">{lowStockProducts.length}</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">All products in stock!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockProducts.map(product => (
                                        <div key={product.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-slate-800 text-sm">{product.name}</h4>
                                                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">{product.stock} left</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">₹{product.price}</p>
                                            <button
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="w-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-700 py-1 rounded transition-colors"
                                            >
                                                Reorder Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Popular Products */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-blue-200">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h2 className="text-base sm:text-lg font-bold text-blue-900">Popular Products</h2>
                                <span className="ml-auto text-xs sm:text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{popularProducts.length}</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {popularProducts.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {popularProducts.map((product, idx) => (
                                        <div key={product.id} className="p-3 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs font-bold text-blue-700 bg-blue-100 w-5 h-5 flex items-center justify-center rounded-full">#{idx + 1}</span>
                                                    <h4 className="font-semibold text-slate-800 text-sm">{product.name}</h4>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-600">
                                                <span>₹{product.price}</span>
                                                <span className="font-bold text-blue-700">{product.orderCount} orders</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-linear-to-r from-red-50 to-orange-50 px-4 sm:px-6 py-4 border-b border-red-200">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-red-600" />
                                <h2 className="text-base sm:text-lg font-bold text-red-900">Pending Orders</h2>
                                <span className="ml-auto text-xs sm:text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">{pendingOrders.length}</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {pendingOrders.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No pending orders!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingOrders.map(order => (
                                        <div key={order.id} className="p-3 rounded-lg bg-red-50 border border-red-200 hover:border-red-300 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-slate-800 text-sm">{order.profiles?.full_name || 'Customer'}</h4>
                                                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">₹{order.total_amount}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">{order.order_items?.length || 0} items</p>
                                            <button
                                                onClick={() => {
                                                    updateOrderStatus(order.id, 'accepted')
                                                    window.scrollTo({ top: document.getElementById('recent-orders')?.offsetTop, behavior: 'smooth' })
                                                }}
                                                className="w-full text-xs font-bold bg-green-100 hover:bg-green-200 text-green-700 py-1 rounded transition-colors"
                                            >
                                                Accept Order
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders Section */}
                    <div id="recent-orders" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2" /> Recent Orders
                            </h2>
                        </div>

                        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                    <p>No orders received yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map(order => (
                                        <div key={order.id} className="p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 text-sm">{order.profiles?.full_name || 'Customer'}</h4>
                                                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">₹{order.total_amount}</span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'delivering' ? 'bg-purple-100 text-purple-700' :
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {order.status === 'pending' && (
                                                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                        className="flex-1 text-xs font-bold bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                        className="flex-1 text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {order.status === 'accepted' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'delivering')}
                                                    className="w-full text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded transition-colors mt-2"
                                                >
                                                    Start Delivery
                                                </button>
                                            )}
                                            {order.status === 'delivering' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                    className="w-full text-xs font-bold bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded transition-colors mt-2"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Your Products Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                                <Package className="w-5 h-5 mr-2" /> Your Products
                            </h2>
                        </div>

                        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                                    Loading products...
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-sm font-semibold text-slate-600 mb-1">No products added yet</h3>
                                    <p className="text-xs text-slate-400 mb-4">Start selling by adding your first product.</p>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        Add Product Now
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {products.map((product) => (
                                        <div key={product.id} className="p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h4>
                                                    <p className="text-xs text-slate-500">₹{product.price}</p>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <button 
                                                        onClick={() => navigate(`/vendor/product/${product.id}`)}
                                                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <span className="text-xs text-slate-600">Stock: <strong>{product.stock}</strong></span>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                        product.stock > 20 ? 'bg-green-100 text-green-700' :
                                                        product.stock > 10 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {product.stock > 20 ? 'In Stock' : product.stock > 10 ? 'Low Stock' : 'Critical'}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleProductAvailability(product.id, product.stock)}
                                                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                                                            product.is_available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                        title={product.is_available ? "Click to mark as out of stock" : "Click to mark as in stock"}
                                                    >
                                                        {product.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                        {product.stock > 0 ? 'In Stock' : 'Out'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
