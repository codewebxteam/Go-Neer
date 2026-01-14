import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MOCK_USERS, MOCK_VENDORS, MOCK_ORDERS } from '../../data/mockData'
import { Users, Store, TrendingUp, ShoppingBag } from 'lucide-react'

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
            // Simulate Fetch
            await new Promise(resolve => setTimeout(resolve, 800))

            const userCount = MOCK_USERS.filter(u => u.role === 'user').length
            const vendorCount = MOCK_VENDORS.length // or filter users by role vendor
            const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + (order.total_amount || 0), 0)
            const orderCount = MOCK_ORDERS.length

            setStats({
                users: userCount + 120, // Fake extra users for stats
                vendors: vendorCount + 5,
                revenue: totalRevenue + 15000,
                orders: orderCount + 45
            })
            setLoading(false)
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
                <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <h4 className="font-bold text-slate-700">User Management</h4>
                        <p className="text-sm text-slate-400">View and manage all registered users.</p>
                    </div>
                    <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <h4 className="font-bold text-slate-700">Vendor Approvals</h4>
                        <p className="text-sm text-slate-400">Review pending vendor applications.</p>
                    </div>
                    <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <h4 className="font-bold text-slate-700">System Settings</h4>
                        <p className="text-sm text-slate-400">Configure app-wide parameters.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
