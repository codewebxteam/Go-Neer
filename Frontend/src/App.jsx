import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import MainLayout from './layouts/MainLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Loader from './components/common/Loader'

// Lazy Loading Pages
const Home = lazy(() => import('./pages/user/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Profile = lazy(() => import('./pages/Profile'))
const ProductResults = lazy(() => import('./pages/user/ProductResults'))
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'))
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const VendorMenu = lazy(() => import('./pages/user/VendorMenu'))
const Cart = lazy(() => import('./pages/user/Cart'))
const Checkout = lazy(() => import('./pages/user/Checkout'))
const MyOrders = lazy(() => import('./pages/user/MyOrders'))
const Products = lazy(() => import('./pages/user/Products'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const VendorManagement = lazy(() => import('./pages/admin/VendorManagement'))
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'))

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>

              {/* PUBLIC */}
              <Route index element={<Home />} />

              <Route
                path="login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />

              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              <Route path="search" element={<ProductResults />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="vendor/:id" element={<VendorMenu />} />
              <Route path="cart" element={<Cart />} />

              {/* PROTECTED */}
              <Route
                path="my-products"
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <Products />
                  </ProtectedRoute>
                }
              />

              <Route
                path="checkout"
                element={
                  <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="orders"
                element={
                  <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="vendor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/vendors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <VendorManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={<div className="p-10 text-center">Page Not Found</div>}
              />

            </Route>
          </Routes>
        </Suspense>

        <ToastContainer position="bottom-right" theme="colored" />
      </CartProvider>
    </AuthProvider>
  )
}

export default App;
