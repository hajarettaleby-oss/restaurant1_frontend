import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
        // Optionally verify token with backend
        // const response = await authAPI.getProfile()
        // setUser(response.data)
      } catch (error) {
        logout()
      }
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      toast.success('Welcome back!')
      
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token, user: newUser } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      setUser(newUser)
      setIsAuthenticated(true)
      toast.success('Account created successfully!')
      
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data)
      const updatedUser = response.data
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      toast.success('Profile updated successfully')
      
      return { success: true, user: updatedUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (typeof roles === 'string') {
      return user.role === roles
    }
    return roles.includes(user.role)
  }

  const isVIP = () => {
    return user?.is_vip === true
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isVIP,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
