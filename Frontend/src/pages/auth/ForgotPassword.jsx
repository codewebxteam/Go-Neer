import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import { sendPasswordResetEmail } from '../../services/authService'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!email.trim()) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)

        try {
            await sendPasswordResetEmail(email.trim())
            console.log('Password reset email sent to:', email)
            setEmailSent(true)
            toast.success('Password reset email sent! Check your inbox.')
        } catch (error) {
            console.error('Forgot password error:', error)
            
            let errorMessage = error.message || 'Failed to send reset email'
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many reset attempts. Please try again later.'
            }
            
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-purple-600 mix-blend-multiply"></div>
                <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop" className="w-full h-full object-cover" alt="Water" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center">
                    <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
                    <p className="text-lg opacity-90">We'll help you get back into your account in no time.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
                        <p className="text-slate-500 mt-2">Enter your email and we'll send you a link to reset your password</p>
                    </div>

                    {!emailSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sending Email...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-green-600 font-semibold mb-2">Email Sent Successfully!</div>
                                <p className="text-sm text-green-700">
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                            </div>
                            
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>Please check your email inbox (and spam folder if needed) for the reset link.</p>
                                <p>The link will expire in 1 hour for security reasons.</p>
                            </div>

                            <button
                                onClick={() => setEmailSent(false)}
                                className="w-full text-blue-600 font-semibold py-2 hover:text-blue-700"
                            >
                                Send to Different Email
                            </button>

                            <Link to="/login" className="block text-blue-600 hover:underline font-semibold">
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
