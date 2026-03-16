import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  CreditCard
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleQuantityChange = async (itemId, newQuantity) => {
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setCheckoutLoading(true)
      
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.menu_item_id || item.menu_item?.id,
          quantity: item.quantity,
        })),
        total: getCartTotal(),
      }

      await orderAPI.createOrder(orderData)
      await clearCart()
      
      toast.success('Order placed successfully!')
      navigate('/dashboard/orders')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="min-h-screen pt-20 bg-luxury-black">
      {/* Hero */}
      <section className="py-12 border-b border-luxury-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-luxury-gold/20 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-luxury-gold" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-white">Your Cart</h1>
              <p className="text-luxury-gray-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-luxury-gray-800 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-luxury-gray-600" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-white mb-3">
                Your cart is empty
              </h2>
              <p className="text-luxury-gray-400 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <NavLink to="/menu" className="gold-button inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Browse Menu
              </NavLink>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => {
                    const menuItem = item.menu_item || item
                    const price = menuItem.price || item.price
                    const name = menuItem.name || 'Unknown Item'
                    const image = menuItem.image || '/images/food/salad.png'

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="glass-card p-4 sm:p-6"
                      >
                        <div className="flex gap-4 sm:gap-6">
                          {/* Image */}
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-4">
                              <div>
                                <h3 className="font-serif text-lg font-semibold text-white mb-1">
                                  {name}
                                </h3>
                                <p className="text-luxury-gold font-semibold">
                                  {price} MAD
                                </p>
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemove(item.id)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-luxury-gray-400 hover:text-red-400 transition-colors self-start"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-lg bg-luxury-gray-800 flex items-center justify-center text-white hover:bg-luxury-gray-700 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                
                                <span className="w-8 text-center font-medium text-white">
                                  {item.quantity}
                                </span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-lg bg-luxury-gray-800 flex items-center justify-center text-white hover:bg-luxury-gray-700 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>

                              <span className="font-serif text-lg font-bold text-white">
                                {price * item.quantity} MAD
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Continue Shopping */}
                <NavLink
                  to="/menu"
                  className="inline-flex items-center gap-2 text-luxury-gray-400 hover:text-luxury-gold transition-colors mt-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </NavLink>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 sticky top-32"
                >
                  <h2 className="font-serif text-xl font-semibold text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-luxury-gray-400">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between text-luxury-gray-400">
                      <span>Tax (10%)</span>
                      <span>{tax.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between text-luxury-gray-400">
                      <span>Delivery</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="h-px bg-luxury-gray-800" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-serif text-2xl font-bold text-luxury-gold">
                        {total.toFixed(2)} MAD
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.length === 0}
                    className="gold-button w-full flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-luxury-gray-500 text-center mt-4">
                    Secure checkout powered by our trusted payment partners
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Cart
