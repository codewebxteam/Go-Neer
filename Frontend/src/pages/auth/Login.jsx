import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { user, error, profile } = await login(formData.email.trim(), formData.password)

            if (error) throw error

            console.log('Login successful:', { user: user?.email, profile })
            toast.success('Welcome back!')

            // Add small delay to ensure auth state is updated
            setTimeout(() => {
                console.log('Redirecting... Profile role:', profile?.role)
                // Redirect based on role
                if (profile?.role === 'vendor') {
                    console.log('Navigating to vendor dashboard')
                    navigate('/vendor/dashboard')
                } else if (profile?.role === 'admin') {
                    console.log('Navigating to admin dashboard')
                    navigate('/admin/dashboard')
                } else {
                    console.log('Navigating to home')
                    navigate('/')
                }
            }, 500)

        } catch (error) {
            console.error('Login error:', error)
            // Handle specific Firebase errors
            let errorMessage = error.message || 'Login failed'
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please sign up first.'
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.'
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please try again.'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.'
            }
            
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-blue-600 mix-blend-multiply"></div>
                <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop" className="w-full h-full object-cover" alt="Water" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center">
                    <h2 className="text-4xl font-bold mb-6">Hydration, Delivered.</h2>
                    <p className="text-lg opacity-90">Join thousands of satisfied customers who get their daily hydration needs met with Go-Neer.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Log in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="user@test.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="password123"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account</Link>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-200">
                        <p className="font-bold mb-1">Firebase Backend Active</p>
                        <p>Create a new account or use existing credentials to sign in</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
