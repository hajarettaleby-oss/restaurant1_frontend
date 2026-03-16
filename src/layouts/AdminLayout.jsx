import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Star,
  Crown,
  Package,
  Grid3X3,
  Menu,
  X,
  LogOut,
  ChefHat,
  UtensilsCrossed,
  CreditCard,
  Settings,
  Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'

const adminLinks = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/employees', icon: Users, label: 'Employees' },
  { path: '/admin/reservations', icon: Calendar, label: 'Reservations' },
  { path: '/admin/reviews', icon: Star, label: 'Reviews' },
  { path: '/admin/vip', icon: Crown, label: 'VIP Clients' },
  { path: '/admin/inventory', icon: Package, label: 'Inventory' },
  { path: '/admin/tables', icon: Grid3X3, label: 'Tables' },
]

const chefLinks = [
  { path: '/chef', icon: ChefHat, label: 'Kitchen Orders', exact: true },
]

const waiterLinks = [
  { path: '/waiter', icon: UtensilsCrossed, label: 'Service Orders', exact: true },
]

const cashierLinks = [
  { path: '/cashier', icon: CreditCard, label: 'Payments', exact: true },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Determine which links to show based on current route and role
  const getNavLinks = () => {
    if (location.pathname.startsWith('/chef')) return chefLinks
    if (location.pathname.startsWith('/waiter')) return waiterLinks
    if (location.pathname.startsWith('/cashier')) return cashierLinks
    return adminLinks
  }

  const getTitle = () => {
    if (location.pathname.startsWith('/chef')) return 'Chef Panel'
    if (location.pathname.startsWith('/waiter')) return 'Waiter Panel'
    if (location.pathname.startsWith('/cashier')) return 'Cashier Panel'
    return 'Admin Dashboard'
  }

  const navLinks = getNavLinks()

  return (
    <div className="min-h-screen flex bg-luxury-black">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-luxury-gray-900 border-r border-luxury-gray-800 transform lg:transform-none transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-luxury-gray-800">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-luxury-gold flex items-center justify-center">
                <span className="font-serif font-bold text-luxury-black text-xl">E</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-white">ETTALEBY</h1>
                <p className="text-xs text-luxury-gold tracking-widest">PLATES</p>
              </div>
            </NavLink>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-luxury-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                {user?.role === 'admin' && <Settings className="w-6 h-6 text-luxury-gold" />}
                {user?.role === 'chef' && <ChefHat className="w-6 h-6 text-luxury-gold" />}
                {user?.role === 'waiter' && <UtensilsCrossed className="w-6 h-6 text-luxury-gold" />}
                {user?.role === 'cashier' && <CreditCard className="w-6 h-6 text-luxury-gold" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{user?.name}</p>
                <p className="text-sm text-luxury-gold capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Role-based Quick Links */}
          {hasRole('admin') && (
            <div className="p-4 border-b border-luxury-gray-800">
              <p className="text-xs text-luxury-gray-500 uppercase tracking-wider mb-3">Quick Access</p>
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/chef"
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-luxury-gray-800 hover:bg-luxury-gray-700 text-xs text-luxury-gray-300 hover:text-white transition-colors"
                >
                  <ChefHat className="w-4 h-4" />
                  Chef
                </NavLink>
                <NavLink
                  to="/waiter"
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-luxury-gray-800 hover:bg-luxury-gray-700 text-xs text-luxury-gray-300 hover:text-white transition-colors"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Waiter
                </NavLink>
                <NavLink
                  to="/cashier"
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-luxury-gray-800 hover:bg-luxury-gray-700 text-xs text-luxury-gray-300 hover:text-white transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Cashier
                </NavLink>
                <NavLink
                  to="/admin"
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-luxury-gold/20 hover:bg-luxury-gold/30 text-xs text-luxury-gold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </NavLink>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs text-luxury-gray-500 uppercase tracking-wider mb-3">{getTitle()}</p>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-luxury-gray-800 space-y-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-luxury-gray-900/95 backdrop-blur-lg border-b border-luxury-gray-800 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-luxury-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <h1 className="font-serif text-xl font-bold text-white">{getTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-luxury-gray-800 transition-colors">
                <Bell className="w-5 h-5 text-luxury-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-luxury-gold rounded-full" />
              </button>
              <NavLink 
                to="/" 
                className="hidden sm:flex items-center gap-2 text-sm text-luxury-gray-400 hover:text-white transition-colors"
              >
                View Site
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          className="flex-1 p-6 lg:p-8 overflow-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

export default AdminLayout
