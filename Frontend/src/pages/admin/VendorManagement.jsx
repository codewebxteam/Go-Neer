import { useEffect, useState } from 'react'
import { getVendors } from '../../services/vendorService'
import { toggleVendorStatus, verifyVendor, deleteVendor } from '../../services/adminService'
import { Search, Trash2, Power, CheckCircle, Store, AlertCircle, MapPin, Phone, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function VendorManagement() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'verified', 'inactive'
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        fetchVendors()
    }, [])

    const fetchVendors = async () => {
        try {
            setLoading(true)
            const data = await getVendors()
            setVendors(data)
        } catch (error) {
            toast.error("Failed to fetch vendors")
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (vendor) => {
        try {
            setProcessingId(vendor.id)
            await verifyVendor(vendor.id)
            setVendors(vendors.map(v =>
                v.id === vendor.id ? { ...v, is_verified: true, is_active: true } : v
            ))
            toast.success("Vendor verified successfully")
        } catch (error) {
            console.error("Error verifying vendor:", error)
            toast.error(`Failed to verify vendor: ${error.message}`)
        } finally {
            setProcessingId(null)
        }
    }

    const handleToggleStatus = async (vendor) => {
        try {
            setProcessingId(vendor.id)
            const currentStatus = vendor.is_active !== false
            const newStatus = await toggleVendorStatus(vendor.id, currentStatus)
            setVendors(vendors.map(v =>
                v.id === vendor.id ? { ...v, is_active: newStatus } : v
            ))
            toast.success(`Vendor ${newStatus ? 'activated' : 'deactivated'} successfully`)
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error(`Failed to update status: ${error.message}`)
        } finally {
            setProcessingId(null)
        }
    }

    const handleDelete = async (vendorId) => {
        if (!window.confirm("Are you sure you want to permanently delete this vendor? This cannot be undone.")) return

        try {
            setProcessingId(vendorId)
            await deleteVendor(vendorId)
            setVendors(vendors.filter(v => v.id !== vendorId))
            toast.success("Vendor deleted successfully")
        } catch (error) {
            console.error("Error deleting vendor:", error)
            toast.error(`Failed to delete vendor: ${error.message}`)
        } finally {
            setProcessingId(null)
        }
    }

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch =
            vendor.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        if (filter === 'pending') return !vendor.is_verified
        if (filter === 'verified') return vendor.is_verified
        if (filter === 'inactive') return vendor.is_active === false
        return true
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Store className="w-8 h-8 text-emerald-600" />
                        Vendor Management
                    </h1>
                    <p className="text-slate-500 mt-1">Verify and manage water vendors</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'verified', 'inactive'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                            ? 'bg-slate-800 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-600">Shop / Vendor</th>
                                    <th className="p-4 font-semibold text-slate-600">Contact</th>
                                    <th className="p-4 font-semibold text-slate-600">Verification</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.length > 0 ? (
                                    filteredVendors.map((vendor) => (
                                        <motion.tr
                                            key={vendor.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                                        <Store className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{vendor.shop_name || 'No Shop Name'}</div>
                                                        <div className="text-sm text-slate-500">{vendor.full_name}</div>
                                                        {vendor.gstin && <div className="text-xs text-slate-400 mt-0.5">GST: {vendor.gstin}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                    {vendor.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            {vendor.phone}
                                                        </div>
                                                    )}
                                                    {vendor.email && (
                                                        <div className="text-xs text-slate-400 truncate max-w-[150px]">{vendor.email}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${vendor.is_verified
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {vendor.is_verified ? (
                                                        <>Verified <CheckCircle className="w-3 h-3" /></>
                                                    ) : (
                                                        <>Pending</>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${vendor.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {vendor.is_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    {!vendor.is_verified && (
                                                        <button
                                                            onClick={() => handleVerify(vendor)}
                                                            disabled={processingId === vendor.id}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Verify Vendor"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleToggleStatus(vendor)}
                                                        disabled={processingId === vendor.id}
                                                        className={`p-2 rounded-lg transition-colors ${vendor.is_active !== false
                                                            ? 'text-red-500 hover:bg-red-50'
                                                            : 'text-green-500 hover:bg-green-50'
                                                            }`}
                                                        title={vendor.is_active !== false ? "Deactivate" : "Activate"}
                                                    >
                                                        <Power className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vendor.id)}
                                                        disabled={processingId === vendor.id}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Vendor"
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
                                                <p>No vendors found matching criteria</p>
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
