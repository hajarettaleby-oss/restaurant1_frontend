import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    
    // For demo purposes, simulate login
    const result = await login(formData)
    
    if (!result.success) {
      // Demo: allow login anyway with mock data
      const mockUser = {
        id: 1,
        name: 'Demo User',
        email: formData.email,
        role: formData.email.includes('admin') ? 'admin' : 
              formData.email.includes('chef') ? 'chef' :
              formData.email.includes('waiter') ? 'waiter' :
              formData.email.includes('cashier') ? 'cashier' : 'client',
        is_vip: true,
      }
      
      localStorage.setItem('token', 'demo-token-123')
      localStorage.setItem('user', JSON.stringify(mockUser))
      window.location.href = mockUser.role === 'admin' ? '/admin' :
                             mockUser.role === 'chef' ? '/chef' :
                             mockUser.role === 'waiter' ? '/waiter' :
                             mockUser.role === 'cashier' ? '/cashier' : '/dashboard'
      return
    }
    
    setLoading(false)
    
    // Redirect based on role
    const user = result.user
    if (user.role === 'admin') {
      navigate('/admin')
    } else if (user.role === 'chef') {
      navigate('/chef')
    } else if (user.role === 'waiter') {
      navigate('/waiter')
    } else if (user.role === 'cashier') {
      navigate('/cashier')
    } else {
      navigate(from)
    }
  }

  const handleSocialLogin = (provider) => {
    // Placeholder for social login
    window.location.href = `http://localhost:8000/api/auth/${provider}`
  }

  return (
    <div className="min-h-screen pt-20 bg-luxury-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <NavLink to="/" className="inline-block mb-6">
              <div className="w-16 h-16 mx-auto rounded-xl bg-luxury-gold flex items-center justify-center">
                <span className="font-serif font-bold text-luxury-black text-3xl">E</span>
              </div>
            </NavLink>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-luxury-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg font-medium hover:bg-[#166FE5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxury-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-luxury-gray-900 text-luxury-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="luxury-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`luxury-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="luxury-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`luxury-input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray-500 hover:text-luxury-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-luxury-gray-600 text-luxury-gold focus:ring-luxury-gold bg-luxury-gray-800" />
                <span className="text-sm text-luxury-gray-400">Remember me</span>
              </label>
              <NavLink to="/forgot-password" className="text-sm text-luxury-gold hover:text-luxury-gold-light">
                Forgot password?
              </NavLink>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gold-button w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-luxury-gray-400 mt-6">
            Don't have an account?{' '}
            <NavLink to="/register" className="text-luxury-gold hover:text-luxury-gold-light font-medium">
              Sign up
            </NavLink>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-luxury-gray-800/50 rounded-lg">
            <p className="text-xs text-luxury-gray-400 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-luxury-gray-500 space-y-1">
              <p>Admin: <span className="text-luxury-gold">admin@demo.com</span></p>
              <p>Chef: <span className="text-luxury-gold">chef@demo.com</span></p>
              <p>Client: <span className="text-luxury-gold">any other email</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
