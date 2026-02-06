import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
// import { MOCK_USERS, MOCK_VENDORS, MOCK_ORDERS } from '../../data/mockData'
import { Link } from 'react-router-dom'
import { getAllUsers } from '../../services/userProfileService'
import { getVendors } from '../../services/vendorService'
import { getAllOrders } from '../../services/orderService'
import { Users, Store, TrendingUp, ShoppingBag, Settings } from 'lucide-react'

export default function AdminDashboard() {
    const { profile } = useAuth()
    const [stats, setStats] = useState({
        users: 0,
        vendors: 0,
        revenue: 0,
        orders: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real data
                const [users, vendors, orders] = await Promise.all([
                    getAllUsers(),
                    getVendors(),
                    getAllOrders()
                ])

                const userCount = users.length
                const vendorCount = vendors.length
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
                const orderCount = orders.length

                setStats({
                    users: userCount,
                    vendors: vendorCount,
                    revenue: totalRevenue,
                    orders: orderCount
                })
            } catch (error) {
                console.error("Error fetching admin stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500">System Overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Users</h3>
                        <Users className="w-6 h-6 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.users}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Vendors</h3>
                        <Store className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.vendors}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Orders</h3>
                        <ShoppingBag className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Revenue</h3>
                        <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">₹{loading ? '...' : stats.revenue.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Platform Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/admin/users" className="group p-6 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all bg-slate-50 hover:bg-white text-left">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">User Management</h4>
                        <p className="text-sm text-slate-500">View users, toggle active status, and manage profiles.</p>
                    </Link>

                    <Link to="/admin/vendors" className="group p-6 border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all bg-slate-50 hover:bg-white text-left">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                            <Store className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">Vendor Management</h4>
                        <p className="text-sm text-slate-500">Verify applications, manage listings, and enforce policies.</p>
                    </Link>

                    <Link to="/admin/settings" className="group p-6 border border-slate-200 rounded-xl hover:border-slate-500 hover:shadow-md transition-all bg-slate-50 hover:bg-white text-left">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors">System Settings</h4>
                        <p className="text-sm text-slate-500">Configure global parameters, fees, and site access.</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
