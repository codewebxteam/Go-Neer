import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Pages
import Home from './pages/user/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import About from './pages/About'
import Contact from './pages/Contact'
import VendorDashboard from './pages/vendor/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import VendorMenu from './pages/user/VendorMenu'
import Products from './pages/user/Products'
import ProductDetail from './pages/user/ProductDetail'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import MyOrders from './pages/user/MyOrders'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={
              <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                <MyOrders />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Must be before dynamic :id routes */}
            <Route path="vendor/dashboard" element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="vendor/:id" element={<VendorMenu />} />
            <Route path="product/:productId" element={<ProductDetail />} />

            <Route path="admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch all 404 */}
            <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" theme="colored" />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
