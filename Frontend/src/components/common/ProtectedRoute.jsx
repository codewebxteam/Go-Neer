import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    if (profile.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (profile.role === "vendor")
      return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
