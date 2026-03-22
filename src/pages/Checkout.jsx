import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Banknote,
  ArrowLeftRight,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Receipt,
  Loader2,
  Info,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  {
    id: 'cash',
    label: 'Cash',
    description: 'Pay at the counter when your order is served',
    icon: Banknote,
    badge: 'Most Popular',
  },
  {
    id: 'card',
    label: 'Card',
    description: 'Credit or debit card — processed at the counter',
    icon: CreditCard,
    badge: null,
  },
  {
    id: 'transfer',
    label: 'Bank Transfer',
    description: 'Wire transfer — confirm with cashier at pickup',
    icon: ArrowLeftRight,
    badge: null,
  },
]

const STEPS = ['Review Order', 'Payment Method', 'Confirmation']

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0) // 0: review, 1: payment method, 2: confirmed
  const [selectedMethod, setSelectedMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [tableId, setTableId] = useState('')
  const [loading, setLoading] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const subtotal = getCartTotal()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      navigate('/login', { state: { from: '/checkout' } })
    }
    if (cart.length === 0 && step < 2) {
      navigate('/cart')
    }
  }, [isAuthenticated, cart.length, step])

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      const orderData = {
        items: cart.map((item) => ({
          menu_item_id: item.menu_item_id || item.menu_item?.id,
          quantity: item.quantity,
        })),
        total: total,
        notes: notes || undefined,
        table_id: tableId ? parseInt(tableId) : undefined,
        preferred_payment_method: selectedMethod,
      }

      const res = await orderAPI.createOrder(orderData)

setPlacedOrder({
  ...(res.data?.order || res.data),
  total: total 
})

setStep(2)
setTimeout(() => {
  clearCart()
}, 500)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-luxury-black">
      {/* Hero */}
      <section className="py-10 border-b border-luxury-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            {step < 2 && (
              <NavLink
                to="/cart"
                className="p-2 rounded-xl text-luxury-gray-400 hover:text-luxury-gold hover:bg-luxury-gray-800 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </NavLink>
            )}
            <div className="w-14 h-14 rounded-xl bg-luxury-gold/20 flex items-center justify-center">
              <Receipt className="w-7 h-7 text-luxury-gold" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-white">Checkout</h1>
              <p className="text-luxury-gray-400 text-sm">Complete your order</p>
            </div>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < step
                        ? 'bg-luxury-gold text-luxury-black'
                        : i === step
                        ? 'bg-luxury-gold/20 border border-luxury-gold text-luxury-gold'
                        : 'bg-luxury-gray-800 text-luxury-gray-500'
                    }`}
                  >
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-sm hidden sm:block transition-colors ${
                      i === step ? 'text-white font-medium' : 'text-luxury-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-8 sm:w-16 transition-colors ${
                      i < step ? 'bg-luxury-gold' : 'bg-luxury-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* ── STEP 0: Review Order ── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Items */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="font-serif text-xl text-white mb-4">Your Items</h2>
                  {cart.map((item, i) => {
                    const menuItem = item.menu_item || item
                    const price = parseFloat(menuItem.price || item.price || 0)
                    const name = menuItem.name || 'Unknown Item'
                    const image = menuItem.image_url
  ? `http://localhost:8000/storage/${menuItem.image_url}`
  : '/images/food/salad.png'
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-4 flex items-center gap-4"
                      >
                        <img
                          src={image}
                          alt={name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-white font-semibold truncate">{name}</p>
                          <p className="text-luxury-gray-400 text-sm">
                            {price} MAD × {item.quantity}
                          </p>
                        </div>
                        <span className="text-luxury-gold font-bold font-serif whitespace-nowrap">
                          {(price * item.quantity).toFixed(2)} MAD
                        </span>
                      </motion.div>
                    )
                  })}

                  {/* Optional fields */}
                  <div className="glass-card p-5 mt-4 space-y-4">
                    <h3 className="text-white font-medium">Order Details (Optional)</h3>
                    <div>
                      <label className="text-luxury-gray-400 text-sm block mb-1">Table Number</label>
                      <input
                        type="number"
                        value={tableId}
                        onChange={(e) => setTableId(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full bg-luxury-gray-800 border border-luxury-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-luxury-gray-600 focus:outline-none focus:border-luxury-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-luxury-gray-400 text-sm block mb-1">Special Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Allergies, preferences, special requests…"
                        rows={3}
                        className="w-full bg-luxury-gray-800 border border-luxury-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-luxury-gray-600 focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <OrderSummaryCard
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  onNext={() => setStep(1)}
                  nextLabel="Choose Payment"
                  nextIcon={<ChevronRight className="w-5 h-5" />}
                />
              </motion.div>
            )}

            {/* ── STEP 1: Payment Method ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="font-serif text-xl text-white mb-2">How would you like to pay?</h2>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 mb-4">
                    <Info className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                    <p className="text-luxury-gray-400 text-sm">
                      Payment is processed by our cashier when your order is ready. Your preference is recorded with the order.
                    </p>
                  </div>

                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    const active = selectedMethod === method.id
                    return (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full text-left glass-card p-5 flex items-center gap-5 border-2 transition-all duration-200 ${
                          active
                            ? 'border-luxury-gold bg-luxury-gold/5'
                            : 'border-transparent hover:border-luxury-gray-700'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            active ? 'bg-luxury-gold/20' : 'bg-luxury-gray-800'
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${active ? 'text-luxury-gold' : 'text-luxury-gray-400'}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${active ? 'text-white' : 'text-luxury-gray-300'}`}>
                              {method.label}
                            </span>
                            {method.badge && (
                              <span className="text-xs bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded-full">
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-luxury-gray-500 text-sm mt-0.5">{method.description}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            active ? 'border-luxury-gold' : 'border-luxury-gray-600'
                          }`}
                        >
                          {active && <div className="w-2.5 h-2.5 rounded-full bg-luxury-gold" />}
                        </div>
                      </motion.button>
                    )
                  })}

                  <button
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-2 text-luxury-gray-500 hover:text-luxury-gold transition-colors text-sm mt-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Review
                  </button>
                </div>

                {/* Summary */}
                <OrderSummaryCard
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  selectedMethod={selectedMethod}
                  onNext={handlePlaceOrder}
                  nextLabel={loading ? 'Placing Order…' : 'Place Order'}
                  nextIcon={
                    loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )
                  }
                  disabled={loading}
                />
              </motion.div>
            )}

            {/* ── STEP 2: Confirmation ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto text-center py-10"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-luxury-gold/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-luxury-gold" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="font-serif text-3xl font-bold text-white mb-3">
                    Order Placed!
                  </h2>
                  <p className="text-luxury-gray-400 mb-6">
                    Your order has been received. Our team will prepare it right away.
                  </p>

                  {/* Order Card */}
                  <div className="glass-card p-6 text-left mb-8 space-y-3">
                    {placedOrder?.id && (
                      <div className="flex justify-between">
                        <span className="text-luxury-gray-400 text-sm">Order ID</span>
                        <span className="text-white font-semibold">#{placedOrder.id}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-luxury-gray-400 text-sm">Amount Due</span>
                      <span className="text-luxury-gold font-serif font-bold text-lg">
                        {placedOrder?.total?.toFixed(2) || total.toFixed(2)} MAD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-luxury-gray-400 text-sm">Payment Method</span>
                      <span className="text-white capitalize">{selectedMethod}</span>
                    </div>
                    <div className="h-px bg-luxury-gray-800" />
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <p className="text-luxury-gray-400 text-sm">
  Payment will be collected by our cashier when your order is served. Please have{' '}
  <span className="text-white font-medium">
    {(placedOrder?.total || total).toFixed(2)} MAD
  </span>{' '}
  ready.
</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <NavLink
                      to="/dashboard/orders"
                      className="gold-button inline-flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Track My Orders
                    </NavLink>
                    <NavLink
                      to="/menu"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-luxury-gray-700 text-luxury-gray-300 hover:border-luxury-gold hover:text-luxury-gold transition-all"
                    >
                      Continue Shopping
                    </NavLink>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

// ─── Reusable Order Summary Sidebar ───────────────────────────────────────────
function OrderSummaryCard({
  subtotal,
  tax,
  total,
  selectedMethod,
  onNext,
  nextLabel,
  nextIcon,
  disabled,
}) {
  const methodLabel = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sticky top-32 h-fit"
    >
      <h2 className="font-serif text-xl font-semibold text-white mb-5">Order Summary</h2>

      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-luxury-gray-400 text-sm">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between text-luxury-gray-400 text-sm">
          <span>Tax (10%)</span>
          <span>{tax.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between text-luxury-gray-400 text-sm">
          <span>Delivery</span>
          <span className="text-green-400">Free</span>
        </div>
        {selectedMethod && (
          <div className="flex justify-between text-luxury-gray-400 text-sm">
            <span>Payment</span>
            <span className="text-luxury-gold capitalize">{methodLabel}</span>
          </div>
        )}
        <div className="h-px bg-luxury-gray-800" />
        <div className="flex justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="font-serif text-2xl font-bold text-luxury-gold">
            {total.toFixed(2)} MAD
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onNext}
        disabled={disabled}
        className="gold-button w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {nextIcon}
        {nextLabel}
      </motion.button>

      <p className="text-xs text-luxury-gray-600 text-center mt-3">
        Secure checkout — ETTALEBY PLATES
      </p>
    </motion.div>
  )
}
