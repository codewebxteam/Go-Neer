import { useEffect, useState } from 'react'
import { getAllUsers } from '../../services/userProfileService'
import { toggleUserStatus, deleteUser } from '../../services/adminService'
import { Search, Trash2, Power, User, Shield, AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function UserManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            // Filter out non-user roles just in case, though usually handled by collections
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error(`Failed to fetch users: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (user) => {
        try {
            setProcessingId(user.id)
            // Default to true if undefined
            const currentStatus = user.is_active !== false
            const newStatus = await toggleUserStatus(user.id, currentStatus)

            setUsers(users.map(u =>
                u.id === user.id ? { ...u, is_active: newStatus } : u
            ))

            toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`)
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setProcessingId(null)
        }
    }

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return

        try {
            setProcessingId(userId)
            await deleteUser(userId)
            setUsers(users.filter(u => u.id !== userId))
            toast.success("User deleted successfully")
        } catch (error) {
            toast.error("Failed to delete user")
        } finally {
            setProcessingId(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1">Manage platform users and their access</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-600">User</th>
                                    <th className="p-4 font-semibold text-slate-600">Role</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Joined</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                        {user.full_name?.charAt(0) || <User className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{user.full_name || 'No Name'}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.is_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm">
                                                {user.created_at?.seconds
                                                    ? new Date(user.created_at.seconds * 1000).toLocaleDateString()
                                                    : 'N/A'
                                                }
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        disabled={processingId === user.id || user.role === 'admin'} // Protect admins
                                                        className={`p-2 rounded-lg transition-colors ${user.is_active !== false
                                                            ? 'text-red-500 hover:bg-red-50'
                                                            : 'text-green-500 hover:bg-green-50'
                                                            }`}
                                                        title={user.is_active !== false ? "Deactivate User" : "Activate User"}
                                                    >
                                                        <Power className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={processingId === user.id || user.role === 'admin'}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertCircle className="w-8 h-8 opacity-50" />
                                                <p>No users found matching "{searchTerm}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

function UsersIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
}
