import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-toastify"
import {
  User,
  Store,
  Mail,
  Lock,
  Phone,
  Loader2,
  CreditCard,
} from "lucide-react"
// NOTE: do not remove BELOW 👇 motion package import otherwise it will be break UI
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/* ================= CONFIG ================= */

const fieldConfig = {
  name: { label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
  shopName: {
    label: "Shop Name",
    type: "text",
    placeholder: "ABC Store",
    icon: Store,
  },
  email: {
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    icon: Mail,
  },
  phone: {
    label: "Phone Number",
    type: "tel",
    placeholder: "9876543210",
    icon: Phone,
  },
  location: {
    label: "Location",
    type: "composite",
    fields: {
      pincode: { label: "Pincode" },
      city: { label: "City", disabled: true },
      street: { label: "Street Address" },
    },
  },
  gstin: {
    label: "GSTIN",
    type: "text",
    placeholder: "22AAAAA0000A1Z5",
    icon: CreditCard,
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
  },
  confirmPassword: {
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
  },
}

const fieldsByRole = {
  user: ["name", "email", "phone", "password", "confirmPassword"],
  vendor: [
    "shopName",
    "email",
    "phone",
    "location",
    "gstin",
    "password",
    "confirmPassword",
  ],
}

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const initialFormData = Object.keys(fieldConfig).reduce((acc, key) => {
  acc[key] =
    fieldConfig[key].type === "composite"
      ? { pincode: "", city: "", street: "" }
      : ""
  return acc
}, {})

/* ================= INPUT FIELD ================= */

const InputField = ({ field, config, formData, handleChange }) => {
  const Icon = config.icon

  return (
    <motion.div layout className="relative">
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
        {config.label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}

        <input
          type={config.type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={config.placeholder}
          required
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none",
            Icon && "pl-11"
          )}
        />
      </div>
    </motion.div>
  )
}

/* ================= COMPONENT ================= */

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("user")
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStreetChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, street: value },
    }))
  }

  const handlePincodeChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        pincode: value,
        city: value.length === 6 ? prev.location.city : "",
      },
    }))

    if (value.length !== 6) return

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${value}`
      )
      const data = await res.json()

      if (data[0]?.Status === "Success") {
        const city = data[0].PostOffice[0].District
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, city },
        }))
      }
    } catch {
      toast.error("Invalid Pincode")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    setLoading(true)

    try {
      const displayName =
        role === "user"
          ? formData.name.trim()
          : formData.shopName.trim()

      const finalLocation =
        role === "vendor"
          ? `${formData.location.street}, ${formData.location.city} - ${formData.location.pincode}`
          : ""

      const profileData = {
        phone: formData.phone,
        location: finalLocation,
        gstin: formData.gstin,
        shopName: formData.shopName,
      }

      const { error } = await signup(
        formData.email.trim(),
        formData.password,
        displayName,
        role,
        profileData
      )

      if (error) throw error

      toast.success("Account created successfully")
      navigate(role === "vendor" ? "/vendor/dashboard" : "/")
    } catch (err) {
      toast.error(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Role Switch */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          {["user", "vendor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r)
                setFormData(initialFormData)
              }}
              className={cn(
                "flex-1 py-2 rounded-lg font-semibold transition",
                role === r
                  ? "bg-white text-blue-600 shadow"
                  : "text-slate-500"
              )}
            >
              {r === "user" ? "User" : "Vendor"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {fieldsByRole[role].map((field) => {
              const config = fieldConfig[field]

              if (config.type === "composite") {
                return (
                  <motion.div
                    key={field}
                    layout
                    className="space-y-3"
                  >
                    <input
                      placeholder="Pincode"
                      maxLength={6}
                      value={formData.location.pincode}
                      onChange={(e) =>
                        handlePincodeChange(e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <input
                      disabled
                      value={formData.location.city}
                      className="w-full bg-slate-100 border rounded-lg px-3 py-2"
                    />
                    <input
                      placeholder="Street Address"
                      value={formData.location.street}
                      onChange={(e) =>
                        handleStreetChange(e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </motion.div>
                )
              }

              return (
                <InputField
                  key={field}
                  field={field}
                  config={config}
                  formData={formData}
                  handleChange={handleChange}
                />
              )
            })}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-xl font-bold flex justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 cursor-pointer font-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
