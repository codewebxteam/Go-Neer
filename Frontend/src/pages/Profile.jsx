import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  LogOut,
  Shield,
  Package,
  Star,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Store,
  Droplets,
  BarChart3,
  DollarSign,
  Users,
  ShoppingBag,
  Camera,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getUserStats, getVendorStats, getRecentOrders } from '../services/profileStatsService'

export default function Profile() {
  const { user, signOut, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({})
  const [orders, setOrders] = useState([])
  const [vendorStats, setVendorStats] = useState({
    totalOrders: 0,
    revenue: 0,
    rating: 0,
    activeProducts: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to view your profile')
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
      })

      // Load real data from database
      if (profile.role === 'user') {
        loadUserOrders()
      } else if (profile.role === 'vendor') {
        loadVendorStats()
      }
    }
  }, [profile])

  const loadUserOrders = async () => {
    try {
      setStatsLoading(true)
      const recentOrders = await getRecentOrders(user.uid, 5)
      setOrders(recentOrders)
    } catch (error) {
      console.error('Failed to fetch user orders:', error)
      toast.error('Failed to load order history')
      setOrders([])
    } finally {
      setStatsLoading(false)
    }
  }

  const loadVendorStats = async () => {
    try {
      setStatsLoading(true)
      const stats = await getVendorStats(user.uid)
      setVendorStats(stats)
    } catch (error) {
      console.error('Failed to fetch vendor stats:', error)
      toast.error('Failed to load vendor statistics')
      setVendorStats({
        totalOrders: 0,
        revenue: 0,
        rating: 0,
        activeProducts: 0,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || '',
    })
  }

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const isVendor = profile.role === 'vendor'
  const isUser = profile.role === 'user'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative group"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {isVendor ? (
                      <Store className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
                    ) : (
                      <User className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                  <Camera className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                    {profile.full_name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Shield className="w-5 h-5 text-cyan-300" />
                    <span className="text-cyan-200 font-semibold capitalize">
                      {profile.role} Account
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <Mail className="w-4 h-4 text-cyan-300" />
                      <span className="text-white text-sm">{user.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <Phone className="w-4 h-4 text-cyan-300" />
                        <span className="text-white text-sm">{profile.phone}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500/90 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="relative">
          <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 -mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  Profile Information
                </h2>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
                        {profile.full_name}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
                        {profile.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-slate-100 rounded-xl text-slate-600 font-medium opacity-60">
                      {user.email}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedProfile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium min-h-[80px]">
                        {profile.address || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Vendor-specific: Bio */}
                  {isVendor && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Business Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedProfile.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          placeholder="Tell customers about your business..."
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium min-h-[100px]">
                          {profile.bio || 'No bio provided'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Account Created */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Member since{' '}
                        <span className="font-semibold text-slate-800">
                          {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString(
                            'en-US',
                            { year: 'numeric', month: 'long' }
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats/Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* Role-based Stats */}
              {isVendor ? (
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Vendor Stats
                  </h3>
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-cyan-100 text-sm">Total Orders</span>
                            <Package className="w-4 h-4 text-cyan-200" />
                          </div>
                          <div className="text-2xl font-black">{vendorStats.totalOrders}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-cyan-100 text-sm">Revenue</span>
                            <DollarSign className="w-4 h-4 text-cyan-200" />
                          </div>
                          <div className="text-2xl font-black">₹{vendorStats.revenue}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-cyan-100 text-sm">Rating</span>
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                          </div>
                          <div className="text-2xl font-black">{vendorStats.rating}/5.0</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-cyan-100 text-sm">Active Products</span>
                            <Droplets className="w-4 h-4 text-cyan-200" />
                          </div>
                          <div className="text-2xl font-black">{vendorStats.activeProducts}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/vendor/dashboard')}
                        className="w-full mt-6 bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all"
                      >
                        Go to Dashboard
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Your Stats
                  </h3>
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-purple-100 text-sm">Total Orders</span>
                            <ShoppingBag className="w-4 h-4 text-purple-200" />
                          </div>
                          <div className="text-2xl font-black">{orders.length}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-purple-100 text-sm">Money Spent</span>
                            <DollarSign className="w-4 h-4 text-purple-200" />
                          </div>
                          <div className="text-2xl font-black">
                            ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-purple-100 text-sm">Member Status</span>
                            <CheckCircle className="w-4 h-4 text-green-300" />
                          </div>
                          <div className="text-lg font-black">Active</div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/orders')}
                        className="w-full mt-6 bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all"
                      >
                        View All Orders
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {isVendor ? (
                    <>
                      <button
                        onClick={() => navigate('/vendor/dashboard')}
                        className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Store className="w-4 h-4" />
                        Manage Products
                      </button>
                      <button className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" />
                        View Orders
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/')}
                        className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Droplets className="w-4 h-4" />
                        Browse Water
                      </button>
                      <button
                        onClick={() => navigate('/orders')}
                        className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Orders (User Only) */}
          {isUser && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Recent Orders
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{order.vendor}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {order.items} item{order.items > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <div className="text-lg font-black text-slate-900">₹{order.total}</div>
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize mt-1">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  View All Orders
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}