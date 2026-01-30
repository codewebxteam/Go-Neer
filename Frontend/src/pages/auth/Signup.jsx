import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Store, Mail, Lock, Phone, Loader2, MapPin, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* ================= CONFIG ================= */

const fieldConfig = {
  name: { label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
  shopName: { label: "Shop Name", type: "text", placeholder: "ABC Store", icon: Store },
  email: { label: "Email Address", type: "email", placeholder: "you@example.com", icon: Mail },
  phone: { label: "Phone Number", type: "tel", placeholder: "9876543210", icon: Phone },
  location: {
    label: "Location",
    type: "composite",
    fields: {
      pincode: { label: "Pincode", type: "text", placeholder: "PIN Code" },
      city: { label: "City", type: "text", placeholder: "City", disabled: true },
      street: { label: "Street Address", type: "text", placeholder: "House no, Street, Area" }
    }
  },
  gstin: { label: "GSTIN", type: "text", placeholder: "22AAAAA0000A1Z5", icon: CreditCard },
  password: { label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
  confirmPassword: { label: "Confirm Password", type: "password", placeholder: "••••••••", icon: Lock }
}

const fieldsByRole = {
  user: ["name", "email", "phone", "password", "confirmPassword"],
  vendor: ["shopName", "email", "phone", "location", "gstin", "password", "confirmPassword"]
}

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const initialFormData = Object.keys(fieldConfig).reduce((acc, key) => {
  acc[key] = fieldConfig[key].type === "composite"
    ? { pincode: "", city: "", street: "" }
    : ""
  return acc
}, {})

/* ================= INPUT FIELD (MOVED OUT) ================= */

const InputField = ({ field, config, formData, handleChange }) => {
  const Icon = config.icon
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative group"
    >
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider ml-1">
        {config.label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        )}
        <input
          type={config.type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={config.placeholder}
          required
          className={cn(
            "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 outline-none placeholder:text-slate-400",
            Icon && "pl-11"
          )}
        />
      </div>
    </motion.div>
  )
}

/* ================= COMPONENT ================= */

export default function Signup() {
<<<<<<< HEAD
  const navigate = useNavigate()
  const { signup } = useAuth()
=======
    const navigate = useNavigate()
    const { signup } = useAuth()
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
>>>>>>> de15d861ec20a127d41c9a00ade04625015e80c7

  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('user')
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleStreetChange = (value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, street: value }
    }))
  }

  const handlePincodeChange = async (value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        pincode: value,
        city: value.length === 6 ? prev.location.city : ""
      }
    }))

    if (value.length !== 6) return

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${value}`)
      const data = await res.json()

      if (data[0]?.Status === "Success") {
        const city = data[0].PostOffice[0].District
        setFormData(prev =>
          prev.location.pincode === value
            ? { ...prev, location: { ...prev.location, city } }
            : prev
        )
      }
    } catch {
      console.error("Pincode lookup failed")
    }
  }

  const handleRoleChange = (newRole) => {
    if (newRole === role) return
    setRole(newRole)
    setFormData(initialFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

<<<<<<< HEAD
    setLoading(true)

    try {
      const displayName =
        role === "user" ? formData.name.trim() : formData.shopName.trim()
=======
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match")
        }
>>>>>>> de15d861ec20a127d41c9a00ade04625015e80c7

      const finalLocation =
        role === "vendor"
          ? `${formData.location.street}, ${formData.location.city} - ${formData.location.pincode}`
          : ""

<<<<<<< HEAD
      const profileData = {
        phone: formData.phone,
        location: finalLocation,
        gstin: formData.gstin,
        shopName: formData.shopName
      }
=======
        try {
            console.log("signup intialize");
            const { error } = await signup({
                email: formData.email.trim(),
                password: formData.password,
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                role: role
            });
>>>>>>> de15d861ec20a127d41c9a00ade04625015e80c7

      const { error } = await signup(
        formData.email.trim(),
        formData.password,
        displayName,
        role,
        profileData
      )

      if (error) throw error

      toast.success("Account created successfully!")
      navigate(role === "vendor" ? "/vendor/dashboard" : "/")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  /* ================= JSX ================= */

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* --- Left Side (Visuals) --- */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-slate-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Water Background"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 via-indigo-900/40 to-slate-900/10" />
        </motion.div>

        <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empower Your <br />
              <span className="text-blue-400">Business Journey</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Join Go-Neer to seamlessly connect, trade, and grow.
              The future of local commerce starts here.
            </p>
          </motion.div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  className="w-10 h-10 rounded-full border-2 border-slate-900"
                  alt="User"
                />
              ))}
=======
    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-cyan-600 mix-blend-multiply"></div>
                <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop" className="w-full h-full object-cover" alt="Water" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center">
                    <h2 className="text-4xl font-bold mb-6">Join the Revolution.</h2>
                    <p className="text-lg opacity-90">Start your journey with Go-Neer today. Whether you are buying or selling, we have got you covered.</p>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Sign up to get started</p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User className="w-4 h-4 mr-2" /> User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('vendor')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${role === 'vendor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Store className="w-4 h-4 mr-2" /> Vendor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70 mt-6"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </div>
                </div>
>>>>>>> de15d861ec20a127d41c9a00ade04625015e80c7
            </div>
            <p className="text-sm font-medium text-slate-300">
              Trusted by 10,000+ users
            </p>
          </div>
        </div>
      </div>

      {/* --- Right Side (Form) --- */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg space-y-8"
        >

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Create an Account</h2>
            <p className="text-slate-500">Enter your details to get started</p>
          </div>

          {/* Role Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
            {['user', 'vendor'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={cn(
                  "flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-xl relative z-10 transition-colors duration-200 capitalize",
                  role === r ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {role === r && (
                  <motion.div
                    layoutId="activeRole"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-20 flex items-center gap-2">
                  {r === 'user' ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  {r} Account
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode='popLayout'>
              {fieldsByRole[role].map((field) => {
                const config = fieldConfig[field]
                return (
                  <div key={field}>
                    {config.type === "composite" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100"
                      >
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          Location Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase">Pincode</label>
                            <input
                              type="text"
                              placeholder="321001"
                              value={formData.location.pincode}
                              maxLength={6}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase">City</label>
                            <input
                              type="text"
                              value={formData.location.city}
                              disabled
                              className="w-full bg-slate-100 border border-transparent rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500 uppercase">Street / Bldg</label>
                          <input
                            type="text"
                            placeholder="House no, Street, Landmark"
                            value={formData.location.street}
                            onChange={(e) => handleStreetChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                            required
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <InputField field={field} config={config} formData={formData} handleChange={handleChange} />
                    )}
                  </div>
                )
              })}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline hover:text-blue-700 decoration-2 underline-offset-4">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}