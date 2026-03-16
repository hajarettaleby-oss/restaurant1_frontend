import { useState, useEffect } from 'react'
import { Package, AlertTriangle, TrendingUp, RefreshCw, Plus, Search, Filter } from 'lucide-react'

export default function AdminInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration
      setInventory([
        { id: 1, name: 'Olive Oil Extra Virgin', category: 'oils', quantity: 25, unit: 'liters', minStock: 10, lastRestocked: '2024-01-10', supplier: 'Mediterranean Imports', price: 45 },
        { id: 2, name: 'Saffron', category: 'spices', quantity: 5, unit: 'grams', minStock: 10, lastRestocked: '2024-01-08', supplier: 'Spice World', price: 320 },
        { id: 3, name: 'Wagyu Beef A5', category: 'meat', quantity: 15, unit: 'kg', minStock: 8, lastRestocked: '2024-01-12', supplier: 'Premium Meats', price: 890 },
        { id: 4, name: 'Black Truffle', category: 'specialty', quantity: 2, unit: 'kg', minStock: 3, lastRestocked: '2024-01-05', supplier: 'Truffle House', price: 1200 },
        { id: 5, name: 'Champagne Dom Perignon', category: 'beverages', quantity: 24, unit: 'bottles', minStock: 12, lastRestocked: '2024-01-11', supplier: 'Fine Wines Co', price: 280 },
        { id: 6, name: 'Fresh Lobster', category: 'seafood', quantity: 8, unit: 'kg', minStock: 10, lastRestocked: '2024-01-13', supplier: 'Ocean Fresh', price: 145 },
        { id: 7, name: 'Foie Gras', category: 'specialty', quantity: 4, unit: 'kg', minStock: 5, lastRestocked: '2024-01-09', supplier: 'French Delicacies', price: 450 },
        { id: 8, name: 'Basmati Rice Premium', category: 'grains', quantity: 50, unit: 'kg', minStock: 20, lastRestocked: '2024-01-07', supplier: 'Asian Foods', price: 12 },
      ])
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'oils', 'spices', 'meat', 'seafood', 'specialty', 'beverages', 'grains']

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock)
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  const getStockStatus = (item) => {
    if (item.quantity <= item.minStock * 0.5) return 'critical'
    if (item.quantity <= item.minStock) return 'low'
    return 'normal'
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'low': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-luxury-gold">Inventory Management</h1>
          <p className="text-luxury-gray-400 mt-1">Track and manage restaurant supplies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg hover:bg-luxury-gold/90 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-gold/20 rounded-lg">
              <Package className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <p className="text-sm text-luxury-gray-400">Total Items</p>
              <p className="text-xl font-bold text-foreground">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-luxury-gray-400">Low Stock</p>
              <p className="text-xl font-bold text-red-400">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-luxury-gray-400">Total Value</p>
              <p className="text-xl font-bold text-emerald-400">{totalValue.toLocaleString()} MAD</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-luxury-gray-400">Categories</p>
              <p className="text-xl font-bold text-foreground">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-400">Low Stock Alert</h3>
              <p className="text-sm text-luxury-gray-300 mt-1">
                {lowStockItems.length} item(s) are running low: {lowStockItems.map(i => i.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-foreground placeholder:text-luxury-gray-500 focus:outline-none focus:border-luxury-gold"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-foreground focus:outline-none focus:border-luxury-gold appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-black/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Unit Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Last Restocked</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-luxury-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-gray-800">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item)
                return (
                  <tr key={item.id} className="hover:bg-luxury-black/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{item.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-luxury-gray-800 text-luxury-gray-300 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStockStatusColor(status)} capitalize`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-luxury-gray-400">
                      {item.supplier}
                    </td>
                    <td className="px-4 py-3 text-luxury-gold font-medium">
                      {item.price} MAD
                    </td>
                    <td className="px-4 py-3 text-luxury-gray-400">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="px-3 py-1 text-sm bg-luxury-gold/20 text-luxury-gold rounded hover:bg-luxury-gold/30 transition-colors">
                        Restock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 text-luxury-gray-400">
          No inventory items found matching your criteria.
        </div>
      )}
    </div>
  )
}
