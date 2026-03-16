import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Bell, CheckCircle, Clock, MapPin, Coffee } from 'lucide-react'

export default function WaiterOrders() {
  const [tables, setTables] = useState([])
  const [readyOrders, setReadyOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    const mockTables = [
      { id: 1, number: 1, status: 'available', capacity: 2, location: 'indoor' },
      { id: 2, number: 2, status: 'occupied', capacity: 4, location: 'indoor', guests: 3, order_status: 'served' },
      { id: 3, number: 3, status: 'occupied', capacity: 4, location: 'indoor', guests: 4, order_status: 'waiting' },
      { id: 4, number: 4, status: 'reserved', capacity: 6, location: 'terrace', reservation_time: '20:00' },
      { id: 5, number: 5, status: 'occupied', capacity: 2, location: 'terrace', guests: 2, order_status: 'ordering' },
      { id: 6, number: 6, status: 'available', capacity: 4, location: 'terrace' },
      { id: 7, number: 7, status: 'available', capacity: 8, location: 'vip' },
      { id: 8, number: 8, status: 'occupied', capacity: 6, location: 'vip', guests: 5, order_status: 'served' },
    ]

    const mockReadyOrders = [
      { id: 1, order_number: 'ORD-002', table_number: 3, items: ['Pastilla au Poulet', 'Salade Marocaine x2'], ready_since: '2 min' },
      { id: 2, order_number: 'ORD-005', table_number: 5, items: ['Thé à la Menthe x2'], ready_since: '1 min' },
    ]

    setTimeout(() => {
      setTables(mockTables)
      setReadyOrders(mockReadyOrders)
      setLoading(false)
    }, 500)
  }, [])

  const markAsDelivered = (orderId) => {
    setReadyOrders(readyOrders.filter(order => order.id !== orderId))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-blue-500'
      case 'reserved': return 'bg-yellow-500'
      default: return 'bg-luxury-gray-500'
    }
  }

  const getLocationIcon = (location) => {
    switch (location) {
      case 'terrace': return '🌿'
      case 'vip': return '⭐'
      default: return '🏠'
    }
  }

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
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
            <Coffee className="w-8 h-8" />
            Waiter Dashboard
          </h1>
          <p className="text-luxury-gray-400 mt-1">Manage tables and serve orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Available</p>
              <p className="text-3xl font-bold text-green-500">{stats.available}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Occupied</p>
              <p className="text-3xl font-bold text-blue-500">{stats.occupied}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-gray-400 text-sm">Reserved</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.reserved}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Ready Orders Alert */}
      {readyOrders.length > 0 && (
        <div className="glass-card p-4 border-l-4 border-luxury-gold">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-luxury-gold animate-pulse" />
            <h2 className="font-serif font-bold text-luxury-gold">Orders Ready for Delivery</h2>
          </div>
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-luxury-black/30 p-3 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-luxury-white">{order.order_number}</span>
                    <span className="text-luxury-gray-400">- Table {order.table_number}</span>
                  </div>
                  <p className="text-sm text-luxury-gray-400">{order.items.join(', ')}</p>
                  <p className="text-xs text-luxury-gold mt-1">Ready {order.ready_since} ago</p>
                </div>
                <button
                  onClick={() => markAsDelivered(order.id)}
                  className="px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg font-medium hover:bg-luxury-gold-light transition-colors"
                >
                  Delivered
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div>
        <h2 className="font-serif font-bold text-luxury-gold text-lg mb-4">Table Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <motion.div
              key={table.id}
              whileHover={{ scale: 1.02 }}
              className={`glass-card p-4 cursor-pointer border-2 ${
                table.status === 'available' ? 'border-green-500/50 hover:border-green-500' :
                table.status === 'occupied' ? 'border-blue-500/50 hover:border-blue-500' :
                'border-yellow-500/50 hover:border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-luxury-white">T{table.number}</span>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></span>
              </div>
              
              <div className="flex items-center gap-1 text-luxury-gray-400 text-sm mb-2">
                <MapPin className="w-3 h-3" />
                {getLocationIcon(table.location)} {table.location}
              </div>
              
              <div className="flex items-center gap-1 text-luxury-gray-400 text-sm mb-3">
                <Users className="w-3 h-3" />
                {table.guests || 0}/{table.capacity} guests
              </div>

              {table.status === 'occupied' && table.order_status && (
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  table.order_status === 'served' ? 'bg-green-500/20 text-green-400' :
                  table.order_status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {table.order_status}
                </span>
              )}

              {table.status === 'reserved' && table.reservation_time && (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                  Reserved {table.reservation_time}
                </span>
              )}

              {table.status === 'available' && (
                <button className="w-full mt-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors">
                  Seat Guests
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
