import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/reservation', label: 'Reservation' },
  { path: '/reviews', label: 'Reviews' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, hasRole } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const cartCount = getCartCount()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const getDashboardLink = () => {
    if (hasRole('admin')) return '/admin'
    if (hasRole('chef')) return '/chef'
    if (hasRole('waiter')) return '/waiter'
    if (hasRole('cashier')) return '/cashier'
    return '/dashboard'
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-luxury-black/95 backdrop-blur-lg shadow-lg border-b border-luxury-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 rounded-lg bg-luxury-gold flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-serif font-bold text-luxury-black text-xl">E</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-lg text-white group-hover:text-luxury-gold transition-colors">
                ETTALEBY
              </h1>
              <p className="text-xs text-luxury-gold tracking-widest">PLATES</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative ${
                    isActive ? 'text-luxury-gold' : 'text-white hover:text-luxury-gold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-luxury-gold"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Cart */}
            <NavLink to="/cart" className="relative p-2 hover:bg-luxury-gray-800 rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-luxury-black text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </NavLink>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-luxury-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-luxury-gold" />
                  </div>
                  <span className="hidden md:block text-sm text-white">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-luxury-gray-900 border border-luxury-gray-800 rounded-xl shadow-luxury overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-luxury-gray-800">
                          <p className="font-medium text-white truncate">{user?.name}</p>
                          <p className="text-xs text-luxury-gray-400 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <NavLink
                            to={getDashboardLink()}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-luxury-gray-300 hover:text-white hover:bg-luxury-gray-800 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </NavLink>
                          {hasRole('admin') && (
                            <NavLink
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-luxury-gray-300 hover:text-white hover:bg-luxury-gray-800 rounded-lg transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Admin Panel
                            </NavLink>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-white hover:text-luxury-gold transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="gold-button text-sm py-2"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-luxury-gray-800 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-gray-900 border-t border-luxury-gray-800"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-luxury-gold/10 text-luxury-gold'
                        : 'text-white hover:bg-luxury-gray-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-luxury-gray-800 space-y-2">
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg text-sm font-medium text-white hover:bg-luxury-gray-800 transition-colors"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block gold-button text-center text-sm"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
