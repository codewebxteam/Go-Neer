import { useState } from 'react'
import { Settings, Save, Server, Shield, Bell, Database, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function SystemSettings() {
    // ... existing state ...
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistration: true,
        platformFee: 5,
        emailNotifications: true,
        autoApproveVendors: false
    })
    const [saving, setSaving] = useState(false)

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        // Simulate API call
        setTimeout(() => {
            setSaving(false)
            toast.success("System settings updated successfully")
        }, 800)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-slate-600" />
                    System Settings
                </h1>
                <p className="text-slate-500 mt-1">Configure global application parameters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Server className="w-5 h-5 text-blue-500" />
                            General Configuration
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <div className="font-semibold text-slate-700">Maintenance Mode</div>
                                    <div className="text-sm text-slate-500">Temporarily disable access for non-admin users</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <div className="font-semibold text-slate-700">Allow New Registrations</div>
                                    <div className="text-sm text-slate-500">Enable or disable new user signups</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.allowRegistration}
                                        onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-slate-700">Platform Commission Fee (%)</div>
                                    <div className="text-sm text-slate-500">Percentage taken from each order</div>
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        value={settings.platformFee}
                                        onChange={(e) => handleChange('platformFee', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            Security & Access
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <div className="font-semibold text-slate-700">Auto-Approve Vendors</div>
                                    <div className="text-sm text-slate-500">Skip manual verification for new vendors (Not Recommended)</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoApproveVendors}
                                        onChange={(e) => handleChange('autoApproveVendors', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                                <Database className="w-4 h-4" />
                                System Status
                            </div>
                            <div className="space-y-2 text-sm text-blue-600">
                                <div className="flex justify-between">
                                    <span>Database Status</span>
                                    <span className="font-bold">Healthy</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Backup</span>
                                    <span className="font-bold">2 hours ago</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pending Tasks</span>
                                    <span className="font-bold">0</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
