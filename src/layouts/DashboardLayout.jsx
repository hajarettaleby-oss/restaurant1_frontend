import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  User, 
  Menu,
  X,
  LogOut,
  Crown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'

const sidebarLinks = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
  { path: '/dashboard/reservations', icon: Calendar, label: 'Reservations' },
  { path: '/dashboard/favorites', icon: Heart, label: 'Favorites' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
]

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isVIP } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
                <User className="w-6 h-6 text-luxury-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{user?.name || 'Guest'}</p>
                  {isVIP() && (
                    <Crown className="w-4 h-4 text-luxury-gold" />
                  )}
                </div>
                <p className="text-sm text-luxury-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/dashboard'}
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
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-luxury-gray-900/95 backdrop-blur-lg border-b border-luxury-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-luxury-gray-800 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <span className="font-serif font-bold text-luxury-gold">ETTALEBY PLATES</span>
            <div className="w-10" />
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

export default DashboardLayout
