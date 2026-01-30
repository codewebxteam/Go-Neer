import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function MainLayout() {
    const { user, signOut, profile } = useAuth()
    const { cartItems } = useCart()
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleSignOut = async (e) => {
        // Prevent event bubbling to avoid closing menu immediately if that interferes (though we close it manually)
        e.stopPropagation()
        console.log("Layout: Sign Out requested")

        setIsProfileOpen(false)

        await signOut()

        console.log("Layout: Sign Out complete, navigating...")
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
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
                    </nav>

                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}


                        {user ? (
                            <>
                                <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <ShoppingCart className="w-6 h-6 text-slate-700" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            console.log("Dropdown Clicked. Profile:", profile)
                                            setIsProfileOpen(!isProfileOpen)
                                        }}
                                        className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                            {profile?.full_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <>
                                            {/* Click outside to close */}
                                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>

                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{profile?.full_name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    {profile?.role === 'vendor' && (
                                                        <Link
                                                            to="/vendor/dashboard"
                                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                                            onClick={() => setIsProfileOpen(false)}
                                                        >
                                                            Vendor Dashboard
                                                        </Link>
                                                    )}
                                                    {profile?.role === 'admin' && (
                                                        <Link
                                                            to="/admin/dashboard"
                                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                                            onClick={() => setIsProfileOpen(false)}
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="border-t border-slate-100 py-1">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium"
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                </>
                                ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                                        Sign Up
                                    </Link>
                                </div>
                        )}

                                {/* Mobile Menu Button */}
                                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <Menu className="w-6 h-6" />
                                </button>
                            </div>
                    </div>
            </header>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2">
                    <Link to="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/vendors" className="block py-2" onClick={() => setIsMenuOpen(false)}>Vendors</Link>
                    {user && (
                        <Link to="/orders" className="block py-2" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                    )}
                </div>
            )}

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Go-Neer</h3>
                        <p className="text-sm">Premium water delivery service directly to your doorstep.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Social</h4>
                        <div className="flex space-x-4">
                            {/* Icons would go here */}
                            <span>Instagram</span>
                            <span>Twitter</span>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs">
                    © {new Date().getFullYear()} Go-Neer. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
