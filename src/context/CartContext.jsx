import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      // Load cart from localStorage for guests
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        setCart(JSON.parse(localCart))
      }
    }
  }, [isAuthenticated])

  // Save to localStorage when cart changes (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isAuthenticated])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartAPI.getCart()
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (item, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await cartAPI.addToCart({ menu_item_id: item.id, quantity })
        await fetchCart()
      } else {
        // Local cart for guests
        const existingIndex = cart.findIndex(i => i.menu_item_id === item.id)
        
        if (existingIndex > -1) {
          const newCart = [...cart]
          newCart[existingIndex].quantity += quantity
          setCart(newCart)
        } else {
          setCart([...cart, {
            id: Date.now(),
            menu_item_id: item.id,
            menu_item: item,
            quantity,
            price: item.price,
          }])
        }
      }
      
      toast.success(`${item.name} added to cart`)
      return { success: true }
    } catch (error) {
      toast.error('Failed to add item to cart')
      return { success: false }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(itemId)
      }

      if (isAuthenticated) {
        await cartAPI.updateCartItem(itemId, { quantity })
        await fetchCart()
      } else {
        setCart(cart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        ))
      }
      
      return { success: true }
    } catch (error) {
      toast.error('Failed to update quantity')
      return { success: false }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(itemId)
        await fetchCart()
      } else {
        setCart(cart.filter(item => item.id !== itemId))
      }
      
      toast.success('Item removed from cart')
      return { success: true }
    } catch (error) {
      toast.error('Failed to remove item')
      return { success: false }
    }
  }

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart()
      }
      setCart([])
      localStorage.removeItem('cart')
      
      return { success: true }
    } catch (error) {
      toast.error('Failed to clear cart')
      return { success: false }
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.menu_item?.price || item.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
