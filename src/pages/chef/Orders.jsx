import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, AlertCircle, ChefHat, Timer, Utensils } from 'lucide-react'

export default function ChefOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    const mockOrders = [
      {
        id: 1,
        order_number: 'ORD-001',
        table_number: 5,
        items: [
          { name: 'Tajine Royal', quantity: 2, notes: 'Extra spicy' },
          { name: 'Couscous Traditionnel', quantity: 1, notes: '' },
        ],
        status: 'pending',
        priority: 'high',
        created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        type: 'dine-in'
      },
      {
        id: 2,
        order_number: 'ORD-002',
        table_number: 3,
        items: [
          { name: 'Pastilla au Poulet', quantity: 1, notes: '' },
          { name: 'Salade Marocaine', quantity: 2, notes: 'No onions' },
        ],
        status: 'preparing',
        priority: 'normal',
        created_at: new Date(Date.now() - 25 * 60000).toISOString(),
        type: 'dine-in'
      },
      {
        id: 3,
        order_number: 'ORD-003',
        table_number: null,
        items: [
          { name: 'Mechoui', quantity: 1, notes: 'Well done' },
        ],
        status: 'pending',
        priority: 'normal',
        created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        type: 'delivery'
      },
    ]
    
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 500)
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getTimeElapsed = (createdAt) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt)) / 60000)
    if (minutes < 60) return `${minutes} min`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
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
            <ChefHat className="w-8 h-8" />
            Kitchen Orders
          </h1>
          <p className="text-luxury-gray-400 mt-1">Manage and prepare incoming orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Preparing</p>
              <p className="text-3xl font-bold text-blue-500">{stats.preparing}</p>
            </div>
            <Timer className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Ready</p>
              <p className="text-3xl font-bold text-green-500">{stats.ready}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-luxury-gray-700 pb-2">
        {['all', 'pending', 'preparing', 'ready'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors capitalize ${
              filter === tab
                ? 'bg-luxury-gold text-luxury-black'
                : 'text-luxury-gray-400 hover:text-luxury-gold'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-card p-4 border-l-4 ${
                order.priority === 'high' ? 'border-red-500' :
                order.status === 'preparing' ? 'border-blue-500' :
                order.status === 'ready' ? 'border-green-500' :
                'border-yellow-500'
              }`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-luxury-gold">{order.order_number}</span>
                  {order.priority === 'high' && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-luxury-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {getTimeElapsed(order.created_at)}
                </div>
              </div>

              {/* Table/Type Info */}
              <div className="mb-3 pb-3 border-b border-luxury-gray-700">
                {order.table_number ? (
                  <span className="text-sm text-luxury-gray-300">
                    Table {order.table_number}
                  </span>
                ) : (
                  <span className="text-sm text-luxury-gray-300 flex items-center gap-1">
                    <Utensils className="w-4 h-4" />
                    {order.type === 'delivery' ? 'Delivery' : 'Takeaway'}
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <span className="text-luxury-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.notes && (
                        <p className="text-xs text-luxury-gold italic mt-0.5">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <div className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium text-center">
                    Ready for Pickup
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-luxury-gray-600 mx-auto mb-4" />
          <p className="text-luxury-gray-400">No orders in this category</p>
        </div>
      )}
    </div>
  )
}
