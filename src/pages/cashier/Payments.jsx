import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Banknote, Receipt, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react'

export default function CashierPayments() {
  const [pendingPayments, setPendingPayments] = useState([])
  const [completedPayments, setCompletedPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)

  useEffect(() => {
    // Mock data for demonstration
    const mockPending = [
      {
        id: 1,
        order_number: 'ORD-001',
        table_number: 5,
        items: [
          { name: 'Tajine Royal', quantity: 2, price: 180 },
          { name: 'Couscous Traditionnel', quantity: 1, price: 150 },
        ],
        subtotal: 510,
        tax: 51,
        total: 561,
        created_at: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: 2,
        order_number: 'ORD-003',
        table_number: null,
        type: 'delivery',
        items: [
          { name: 'Mechoui', quantity: 1, price: 350 },
        ],
        subtotal: 350,
        tax: 35,
        delivery_fee: 30,
        total: 415,
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ]

    const mockCompleted = [
      {
        id: 3,
        order_number: 'ORD-002',
        table_number: 3,
        total: 285,
        payment_method: 'card',
        paid_at: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 4,
        order_number: 'ORD-004',
        table_number: 7,
        total: 890,
        payment_method: 'cash',
        paid_at: new Date(Date.now() - 60 * 60000).toISOString(),
      },
    ]

    setTimeout(() => {
      setPendingPayments(mockPending)
      setCompletedPayments(mockCompleted)
      setLoading(false)
    }, 500)
  }, [])

  const processPayment = (paymentId, method) => {
    const payment = pendingPayments.find(p => p.id === paymentId)
    if (payment) {
      setPendingPayments(pendingPayments.filter(p => p.id !== paymentId))
      setCompletedPayments([
        {
          ...payment,
          payment_method: method,
          paid_at: new Date().toISOString(),
        },
        ...completedPayments,
      ])
      setSelectedPayment(null)
    }
  }

  const todayTotal = completedPayments.reduce((sum, p) => sum + p.total, 0)

  const stats = {
    pending: pendingPayments.length,
    completed: completedPayments.length,
    todayTotal: todayTotal,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-luxury-gold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Cashier Dashboard
          </h1>
          <p className="text-luxury-gray-400 mt-1">Process payments and manage transactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Completed Today</p>
              <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-luxury-gold">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Today&apos;s Revenue</p>
              <p className="text-3xl font-bold text-luxury-gold">{stats.todayTotal} MAD</p>
            </div>
            <TrendingUp className="w-10 h-10 text-luxury-gold opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="glass-card p-6">
          <h2 className="font-serif font-bold text-luxury-gold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Payments
          </h2>
          
          {pendingPayments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-luxury-gray-400">All payments processed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPayment?.id === payment.id
                      ? 'bg-luxury-gold/10 border-luxury-gold'
                      : 'bg-luxury-black/30 border-luxury-gray-700 hover:border-luxury-gold/50'
                  }`}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-luxury-white">{payment.order_number}</span>
                    <span className="text-luxury-gold font-bold">{payment.total} MAD</span>
                  </div>
                  <div className="text-sm text-luxury-gray-400">
                    {payment.table_number ? `Table ${payment.table_number}` : payment.type}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Details / Process */}
        <div className="glass-card p-6">
          <h2 className="font-serif font-bold text-luxury-gold text-lg mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            {selectedPayment ? 'Process Payment' : 'Select an Order'}
          </h2>

          {selectedPayment ? (
            <div>
              {/* Order Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-luxury-gray-700">
                {selectedPayment.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-luxury-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-luxury-gray-400">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gray-400">Subtotal</span>
                  <span className="text-luxury-gray-300">{selectedPayment.subtotal} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gray-400">Tax (10%)</span>
                  <span className="text-luxury-gray-300">{selectedPayment.tax} MAD</span>
                </div>
                {selectedPayment.delivery_fee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-gray-400">Delivery Fee</span>
                    <span className="text-luxury-gray-300">{selectedPayment.delivery_fee} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-luxury-gray-700">
                  <span className="text-luxury-white">Total</span>
                  <span className="text-luxury-gold">{selectedPayment.total} MAD</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => processPayment(selectedPayment.id, 'cash')}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Banknote className="w-5 h-5" />
                  Cash
                </button>
                <button
                  onClick={() => processPayment(selectedPayment.id, 'card')}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  Card
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-luxury-gray-600 mx-auto mb-4" />
              <p className="text-luxury-gray-400">Select an order to process payment</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h2 className="font-serif font-bold text-luxury-gold text-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Recent Transactions
        </h2>
        
        {completedPayments.length === 0 ? (
          <p className="text-luxury-gray-400 text-center py-4">No transactions yet today</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-luxury-gray-400 text-sm border-b border-luxury-gray-700">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Table</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {completedPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-luxury-gray-800">
                    <td className="py-3 font-medium text-luxury-white">{payment.order_number}</td>
                    <td className="py-3 text-luxury-gray-400">
                      {payment.table_number ? `Table ${payment.table_number}` : '-'}
                    </td>
                    <td className="py-3 text-luxury-gold font-medium">{payment.total} MAD</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        payment.payment_method === 'cash'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {payment.payment_method === 'cash' ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="py-3 text-luxury-gray-400 text-sm">
                      {new Date(payment.paid_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
