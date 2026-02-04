// import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// import { useCart } from '../context/CartContext'
// import { ShoppingCart, User, LogOut, Menu } from 'lucide-react'
// import { useState, useEffect } from 'react'
export default function Profile () {
    const { user, signOut, profile } = useAuth()
  return (
    <div>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {profile?.full_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
        </div>
    </div>
    
  )
}