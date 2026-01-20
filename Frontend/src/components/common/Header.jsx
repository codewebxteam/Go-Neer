import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
    const { user, signOut, profile } = useAuth()
    const { cartItems } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    const handleSignOut = async (e) => {
        e.stopPropagation()
        console.log("Layout: Sign Out requested")
        setIsProfileOpen(false)
        await signOut()
        console.log("Layout: Sign Out complete, navigating...")
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Go-Neer
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="font-medium hover:text-blue-600 transition-colors">Home</Link>
                    {user && (
                        <Link to="/orders" className="font-medium hover:text-blue-600 transition-colors">My Orders</Link>
                    )}
                    <Link to="/about" className="font-medium hover:text-blue-600 transition-colors">About</Link>
                    <Link to="/contact" className="font-medium hover:text-blue-600 transition-colors">Contact</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {/* Cart Icon */}
                    <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ShoppingCart className="w-6 h-6 text-slate-700" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="hidden md:block relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <User className="w-6 h-6 text-slate-700" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 p-4 space-y-3">
                                {user ? (
                                    <>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {profile?.displayName || user.email}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {profile?.role || 'User'}
                                        </div>
                                        {profile?.role === 'vendor' && (
                                            <Link
                                                to="/vendor/dashboard"
                                                className="block text-sm text-blue-600 hover:text-blue-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Vendor Dashboard
                                            </Link>
                                        )}
                                        {profile?.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block text-sm text-blue-600 hover:text-blue-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block text-sm text-blue-600 hover:text-blue-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block text-sm text-blue-600 hover:text-blue-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        <Link to="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        {user && (
                            <Link to="/orders" className="block py-2" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                        )}
                        <Link to="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link to="/contact" className="block py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </div>
                </div>
            )}
        </header>
    )
}
