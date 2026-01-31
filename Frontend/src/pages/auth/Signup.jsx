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
import { motion, AnimatePresence } from "framer-motion"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/* ================= CONFIG ================= */

const fieldConfig = {
  name: {
    label: "Full Name",
    type: "text",
    icon: User,
    placeholder: "John Doe",
  },
  shopName: {
    label: "Shop Name",
    type: "text",
    icon: Store,
    placeholder: "ABC Store",
  },
  email: {
    label: "Email Address",
    type: "email",
    icon: Mail,
    placeholder: "you@example.com",
  },
  phone: {
    label: "Phone Number",
    type: "tel",
    icon: Phone,
    placeholder: "9876543210",
  },
  gstin: {
    label: "GSTIN",
    type: "text",
    icon: CreditCard,
    placeholder: "29ABCDE1234F1Z7",
  },
  password: {
    label: "Password",
    type: "password",
    icon: Lock,
    placeholder: "••••••••",
  },
  confirmPassword: {
    label: "Confirm Password",
    type: "password",
    icon: Lock,
    placeholder: "••••••••",
  },
}

const fieldsByRole = {
  user: ["name", "email", "phone", "password", "confirmPassword"],
  vendor: [
    "shopName",
    "email",
    "phone",
    "gstin",
    "password",
    "confirmPassword",
  ],
}

const initialFormData = {
  name: "",
  shopName: "",
  email: "",
  phone: "",
  gstin: "",
  password: "",
  confirmPassword: "",
  location: {
    pincode: "",
    city: "",
    street: "",
    cityEditable: false,
  },
}

/* ================= INPUT ================= */

const InputField = ({ field, config, formData, onChange }) => {
  const Icon = config.icon
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase">
        {config.label}
      </label>
      <div className="relative mt-1">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          type={config.type}
          value={formData[field]}
          placeholder={config.placeholder}
          onChange={(e) => onChange(field, e.target.value)}
          className={cn(
            "w-full rounded-xl border bg-slate-50 py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none",
            Icon && "pl-10"
          )}
          required
        />
      </div>
    </div>
  )
}

/* ================= COMPONENT ================= */

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /* ===== PINCODE → CITY AUTO / MANUAL ===== */

  const handlePincodeChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        pincode: value,
        city: "",
        cityEditable: false,
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
      } else {
        throw new Error()
      }
    } catch {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, cityEditable: true },
      }))
    }
  }

  /* ===== SUBMIT ===== */

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    setLoading(true)

    try {
      const fullName =
        role === "user"
          ? formData.name.trim()
          : formData.shopName.trim()

      const extraData =
        role === "vendor"
          ? {
              shop_name: formData.shopName,
              gstin: formData.gstin,
              address: formData.location.street,
              city: formData.location.city,
              pincode: formData.location.pincode,
              is_verified: false,
            }
          : {}

      const { error } = await signup({
        email: formData.email.trim(),
        password: formData.password,
        fullName,
        phone: formData.phone,
        role,
        extraData,
      })

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* ROLE SWITCH */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
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
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500"
              )}
            >
              {r === "user" ? "User" : "Vendor"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {fieldsByRole[role].map((field) => (
              <motion.div key={field} layout>
                <InputField
                  field={field}
                  config={fieldConfig[field]}
                  formData={formData}
                  onChange={handleChange}
                />
              </motion.div>
            ))}

            {/* LOCATION (VENDOR ONLY) */}
            {role === "vendor" && (
              <motion.div layout className="space-y-3">
                <input
                  placeholder="Pincode"
                  maxLength={6}
                  value={formData.location.pincode}
                  onChange={(e) =>
                    handlePincodeChange(e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 placeholder:text-slate-400"
                />

                <input
                  placeholder={
                    formData.location.cityEditable
                      ? "Enter City"
                      : "City (auto detected)"
                  }
                  disabled={!formData.location.cityEditable}
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        city: e.target.value,
                      },
                    }))
                  }
                  className={cn(
                    "w-full border rounded-lg px-3 py-2 placeholder:text-slate-400",
                    !formData.location.cityEditable && "bg-slate-100"
                  )}
                />

                <input
                  placeholder="Street Address"
                  value={formData.location.street}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        street: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 placeholder:text-slate-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
