import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Redirect based on role if they try to access unauthorized page
        if (profile.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />
        if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/" replace />
    }

    return children
}
