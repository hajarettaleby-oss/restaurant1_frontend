import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Reservation from './pages/Reservation'
import Reviews from './pages/Reviews'
import Login from './pages/Login'
import Register from './pages/Register'

// Client Dashboard Pages
import ClientDashboard from './pages/client/Dashboard'
import ClientOrders from './pages/client/Orders'
import ClientReservations from './pages/client/Reservations'
import ClientFavorites from './pages/client/Favorites'
import ClientProfile from './pages/client/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminEmployees from './pages/admin/Employees'
import AdminReservations from './pages/admin/Reservations'
import AdminReviews from './pages/admin/Reviews'
import AdminVIP from './pages/admin/VIP'
import AdminInventory from './pages/admin/Inventory'
import AdminTables from './pages/admin/Tables'

// Chef Pages
import ChefOrders from './pages/chef/Orders'

// Waiter Pages
import WaiterOrders from './pages/waiter/Orders'

// Cashier Pages
import CashierPayments from './pages/cashier/Payments'

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute'
import RoleGuard from './components/guards/RoleGuard'
import Checkout from './pages/Checkout'
function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Client Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/dashboard/orders" element={<ClientOrders />} />
          <Route path="/dashboard/reservations" element={<ClientReservations />} />
          <Route path="/dashboard/favorites" element={<ClientFavorites />} />
          <Route path="/dashboard/profile" element={<ClientProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/vip" element={<AdminVIP />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/tables" element={<AdminTables />} />
        </Route>

        {/* Chef Routes */}
        <Route element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['chef', 'admin']}>
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }>
          <Route path="/chef" element={<ChefOrders />} />
          <Route path="/chef/orders" element={<ChefOrders />} />
        </Route>

        {/* Waiter Routes */}
        <Route element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['waiter', 'admin']}>
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }>
          <Route path="/waiter" element={<WaiterOrders />} />
          <Route path="/waiter/orders" element={<WaiterOrders />} />
        </Route>

        {/* Cashier Routes */}
        <Route element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['cashier', 'admin']}>
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }>
          <Route path="/cashier" element={<CashierPayments />} />
          <Route path="/cashier/payments" element={<CashierPayments />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
