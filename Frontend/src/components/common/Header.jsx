import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShoppingCart, User, LogOut, Menu, X, Droplets, Home, Package, Phone, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
    const { user, signOut, profile } = useAuth()
    const { cartItems } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsProfileOpen(false)
        }
        if (isProfileOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isProfileOpen])

    const handleSignOut = async (e) => {
        e.stopPropagation()
        console.log("Layout: Sign Out requested")
        setIsProfileOpen(false)
        await signOut()
        console.log("Layout: Sign Out complete, navigating...")
        navigate('/login')
    }

    const navLinks = [
        { to: '/', label: 'Home', icon: Home, show: true },
        { to: '/my-products', label: (profile?.role == 'vendor' ? 'My Products' : 'All Products'), icon: Package, show: true },
        { to: '/about', label: 'About', icon: Info, show: true },
        { to: '/contact', label: 'Contact', icon: Phone, show: true },
    ]

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-blue-100/50'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
            }`}>
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                            <Droplets className="relative w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                            Go-Neer
                        </span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        link.show && (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${location.pathname === link.to
                                    ? 'text-blue-600'
                                    : 'text-slate-700 hover:text-blue-600'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </span>
                                {location.pathname === link.to && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        )
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Cart Icon */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/cart"
                            className="relative p-2 md:p-2.5 hover:bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full transition-all duration-300 group"
                        >
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                            {cartItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-red-500/50"
                                >
                                    {cartItems.length}
                                </motion.span>
                            )}
                        </Link>
                    </motion.div>

                    {/* Profile Dropdown */}
                    <div className="hidden md:block relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsProfileOpen(!isProfileOpen)
                            }}
                            className="p-2.5 hover:bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full transition-all duration-300 group"
                        >
                            <User className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                        </motion.button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/10 border border-blue-100/50 p-2 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {user ? (
                                        <div className="space-y-1">
                                            <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl mb-2">
                                                <div className="text-sm font-semibold text-slate-900 truncate">
                                                    {profile?.displayName || user.email}
                                                </div>
                                                <div className="text-xs text-blue-600 font-medium mt-1">
                                                    {profile?.role || 'User'}
                                                </div>
                                            </div>

                                            {profile?.role === 'vendor' && (
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/vendor/dashboard"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Vendor Dashboard
                                                    </Link>
                                                </>
                                            )}

                                            {profile?.role === 'admin' && (
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/admin/dashboard"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                </>
                                            )}

                                            {profile?.role === 'user' && (
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/orders"
                                                        className="block px-4 py-1 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        My Orders
                                                    </Link>
                                                </>
                                            )}

                                            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1" />

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg transition-all"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="lg:hidden p-2 hover:bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-slate-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-slate-700" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-blue-100/50"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-2">
                            {navLinks.map((link, index) => (
                                link.show && (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === link.to
                                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                                                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                )
                            ))}

                            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3" />

                            {/* Mobile Profile Section */}
                            {user ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {profile?.displayName || user.email}
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium mt-1">
                                            {profile?.role || 'User'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

