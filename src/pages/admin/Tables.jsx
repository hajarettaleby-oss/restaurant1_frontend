import { useState, useEffect } from 'react'
import { MapPin, Users, Clock, Plus, Edit2, Trash2, Check, X } from 'lucide-react'

export default function AdminTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: 2,
    location: 'indoor',
    status: 'available'
  })

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      // Mock data for demonstration
      const mockTables = [
        { id: 1, table_number: 'T1', capacity: 2, location: 'indoor', status: 'available' },
        { id: 2, table_number: 'T2', capacity: 4, location: 'indoor', status: 'occupied' },
        { id: 3, table_number: 'T3', capacity: 6, location: 'indoor', status: 'reserved' },
        { id: 4, table_number: 'T4', capacity: 4, location: 'terrace', status: 'available' },
        { id: 5, table_number: 'T5', capacity: 8, location: 'terrace', status: 'occupied' },
        { id: 6, table_number: 'T6', capacity: 2, location: 'vip', status: 'available' },
        { id: 7, table_number: 'T7', capacity: 4, location: 'vip', status: 'reserved' },
        { id: 8, table_number: 'T8', capacity: 6, location: 'indoor', status: 'available' },
        { id: 9, table_number: 'T9', capacity: 4, location: 'terrace', status: 'maintenance' },
        { id: 10, table_number: 'T10', capacity: 10, location: 'vip', status: 'available' },
      ]
      setTables(mockTables)
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTable) {
      setTables(tables.map(t => t.id === editingTable.id ? { ...t, ...formData } : t))
    } else {
      setTables([...tables, { id: Date.now(), ...formData }])
    }
    resetForm()
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingTable(null)
    setFormData({ table_number: '', capacity: 2, location: 'indoor', status: 'available' })
  }

  const handleEdit = (table) => {
    setEditingTable(table)
    setFormData({
      table_number: table.table_number,
      capacity: table.capacity,
      location: table.location,
      status: table.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      setTables(tables.filter(t => t.id !== id))
    }
  }

  const updateStatus = (id, newStatus) => {
    setTables(tables.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'occupied': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'reserved': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'maintenance': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getLocationColor = (location) => {
    switch (location) {
      case 'indoor': return 'bg-blue-500/20 text-blue-400'
      case 'terrace': return 'bg-green-500/20 text-green-400'
      case 'vip': return 'bg-amber-500/20 text-amber-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-gold font-serif">Table Management</h1>
          <p className="text-luxury-gray-400 mt-1">Manage restaurant seating and table availability</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg hover:bg-luxury-gold/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-luxury-gold/20 rounded-lg">
              <MapPin className="w-6 h-6 text-luxury-gold" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Total Tables</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Available</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.available}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Occupied</p>
              <p className="text-2xl font-bold text-red-400">{stats.occupied}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Reserved</p>
              <p className="text-2xl font-bold text-amber-400">{stats.reserved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="glass-card p-4 text-center relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => handleEdit(table)}
                className="p-1 bg-luxury-gray-700 rounded hover:bg-luxury-gray-600 transition-colors"
              >
                <Edit2 className="w-3 h-3 text-luxury-gray-300" />
              </button>
              <button
                onClick={() => handleDelete(table.id)}
                className="p-1 bg-red-500/20 rounded hover:bg-red-500/40 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
            
            <div className="text-3xl font-bold text-luxury-gold mb-2">{table.table_number}</div>
            
            <div className="flex items-center justify-center gap-1 text-luxury-gray-400 text-sm mb-3">
              <Users className="w-4 h-4" />
              <span>{table.capacity} seats</span>
            </div>
            
            <span className={`inline-block px-2 py-1 rounded text-xs ${getLocationColor(table.location)} mb-3`}>
              {table.location}
            </span>
            
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(table.status)}`}>
              {table.status}
            </div>

            {table.status === 'available' && (
              <button
                onClick={() => updateStatus(table.id, 'occupied')}
                className="mt-3 w-full py-1.5 bg-luxury-gold/20 text-luxury-gold rounded text-sm hover:bg-luxury-gold/30 transition-colors"
              >
                Seat Guests
              </button>
            )}
            {table.status === 'occupied' && (
              <button
                onClick={() => updateStatus(table.id, 'available')}
                className="mt-3 w-full py-1.5 bg-emerald-500/20 text-emerald-400 rounded text-sm hover:bg-emerald-500/30 transition-colors"
              >
                Clear Table
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-luxury-gold">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-luxury-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-luxury-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-luxury-gray-300 mb-1">Table Number</label>
                <input
                  type="text"
                  value={formData.table_number}
                  onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                  className="luxury-input w-full"
                  placeholder="e.g., T11"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-gray-300 mb-1">Capacity</label>
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="luxury-select w-full"
                >
                  {[2, 4, 6, 8, 10, 12].map(num => (
                    <option key={num} value={num}>{num} seats</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-gray-300 mb-1">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="luxury-select w-full"
                >
                  <option value="indoor">Indoor</option>
                  <option value="terrace">Terrace</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="luxury-select w-full"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 border border-luxury-gray-600 text-luxury-gray-300 rounded-lg hover:bg-luxury-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-luxury-gold text-luxury-black rounded-lg hover:bg-luxury-gold/90 transition-colors font-medium"
                >
                  {editingTable ? 'Update' : 'Add'} Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
