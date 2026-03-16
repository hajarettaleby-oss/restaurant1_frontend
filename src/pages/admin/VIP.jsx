import { useState, useEffect } from 'react'
import { usersAPI } from '../../services/api'
import { 
  Crown, Search, Star, TrendingUp, Users, Gift, Calendar, Mail, Phone,
  Award, Percent, Clock, ChefHat, Wine, Sparkles, Edit2, Trash2, Plus,
  Filter, Download, BarChart3, ArrowUpRight, ArrowDownRight, X, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// VIP Tier Configuration
const VIP_TIERS = {
  silver: {
    name: 'Silver',
    minSpend: 5000,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    benefits: ['5% discount on all orders', 'Priority seating', 'Birthday surprise'],
    icon: Award
  },
  gold: {
    name: 'Gold',
    minSpend: 15000,
    color: 'from-luxury-gold to-yellow-500',
    bgColor: 'bg-luxury-gold/20',
    textColor: 'text-luxury-gold',
    benefits: ['10% discount on all orders', 'VIP lounge access', 'Free dessert monthly', 'Priority reservations'],
    icon: Crown
  },
  platinum: {
    name: 'Platinum',
    minSpend: 30000,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    benefits: ['15% discount on all orders', 'Private dining room', 'Personal sommelier', 'Exclusive events', 'Complimentary valet'],
    icon: Sparkles
  },
  diamond: {
    name: 'Diamond',
    minSpend: 50000,
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    benefits: ['20% discount on all orders', 'Chef\'s table experience', 'Custom menu creation', 'Unlimited reservations', 'Concierge service', 'Anniversary celebration'],
    icon: Star
  }
}

const getTierFromSpend = (totalSpend) => {
  if (totalSpend >= 50000) return 'diamond'
  if (totalSpend >= 30000) return 'platinum'
  if (totalSpend >= 15000) return 'gold'
  return 'silver'
}

export default function AdminVIP() {
  const [vipClients, setVipClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [activeTab, setActiveTab] = useState('members')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'silver',
    special_notes: '',
    favorite_dishes: ''
  })

  useEffect(() => {
    fetchVIPClients()
  }, [])

  const fetchVIPClients = async () => {
    try {
      const response = await usersAPI.getAll({ is_vip: true })
      setVipClients(response.data || [])
    } catch (error) {
      console.error('Error fetching VIP clients:', error)
      // Mock data for demonstration
      setVipClients([
        {
          id: 1,
          name: 'Ahmed El Mansouri',
          email: 'ahmed.mansouri@email.com',
          phone: '+212 661-234567',
          total_spent: 52000,
          visits: 78,
          member_since: '2022-01-15',
          last_visit: '2024-01-10',
          favorite_dishes: ['Pastilla Royale', 'Tagine Agneau'],
          special_notes: 'Prefers corner table, allergic to nuts',
          points: 5200,
          tier: 'diamond'
        },
        {
          id: 2,
          name: 'Fatima Benali',
          email: 'fatima.benali@email.com',
          phone: '+212 662-345678',
          total_spent: 35000,
          visits: 62,
          member_since: '2022-06-20',
          last_visit: '2024-01-12',
          favorite_dishes: ['Couscous Royal', 'Harira'],
          special_notes: 'VIP since 2022, prefers quiet seating',
          points: 3500,
          tier: 'platinum'
        },
        {
          id: 3,
          name: 'Karim Tazi',
          email: 'karim.tazi@email.com',
          phone: '+212 663-456789',
          total_spent: 18500,
          visits: 38,
          member_since: '2023-03-10',
          last_visit: '2024-01-08',
          favorite_dishes: ['Mechoui', 'Briouates'],
          special_notes: 'Business client, often hosts meetings',
          points: 1850,
          tier: 'gold'
        },
        {
          id: 4,
          name: 'Salma Alaoui',
          email: 'salma.alaoui@email.com',
          phone: '+212 664-567890',
          total_spent: 8000,
          visits: 28,
          member_since: '2023-05-05',
          last_visit: '2024-01-11',
          favorite_dishes: ['Tagine Lamb', 'Mint Tea'],
          special_notes: 'Vegetarian options preferred for guests',
          points: 800,
          tier: 'silver'
        },
        {
          id: 5,
          name: 'Omar Benjelloun',
          email: 'omar.benjelloun@email.com',
          phone: '+212 665-678901',
          total_spent: 42000,
          visits: 55,
          member_since: '2022-09-15',
          last_visit: '2024-01-09',
          favorite_dishes: ['Pastilla aux Fruits de Mer', 'Tagine Poulet'],
          special_notes: 'Celebrating anniversary next month',
          points: 4200,
          tier: 'platinum'
        },
        {
          id: 6,
          name: 'Laila Chraibi',
          email: 'laila.chraibi@email.com',
          phone: '+212 666-789012',
          total_spent: 22000,
          visits: 42,
          member_since: '2023-01-20',
          last_visit: '2024-01-13',
          favorite_dishes: ['Couscous Tfaya', 'Baghrir'],
          special_notes: 'Prefers outdoor terrace',
          points: 2200,
          tier: 'gold'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddVIP = async (e) => {
    e.preventDefault()
    try {
      const newClient = {
        id: Date.now(),
        ...formData,
        total_spent: 0,
        visits: 0,
        member_since: new Date().toISOString().split('T')[0],
        last_visit: new Date().toISOString().split('T')[0],
        favorite_dishes: formData.favorite_dishes.split(',').map(d => d.trim()).filter(Boolean),
        points: 0
      }
      setVipClients([...vipClients, newClient])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Error adding VIP client:', error)
    }
  }

  const handleEditVIP = async (e) => {
    e.preventDefault()
    try {
      setVipClients(vipClients.map(client => 
        client.id === selectedClient.id 
          ? { 
              ...client, 
              ...formData,
              favorite_dishes: formData.favorite_dishes.split(',').map(d => d.trim()).filter(Boolean)
            } 
          : client
      ))
      setShowEditModal(false)
      setSelectedClient(null)
      resetForm()
    } catch (error) {
      console.error('Error updating VIP client:', error)
    }
  }

  const handleRemoveVIP = async (clientId) => {
    if (window.confirm('Are you sure you want to remove VIP status from this client?')) {
      try {
        await usersAPI.toggleVIP(clientId)
        setVipClients(vipClients.filter(client => client.id !== clientId))
      } catch (error) {
        console.error('Error removing VIP status:', error)
        setVipClients(vipClients.filter(client => client.id !== clientId))
      }
    }
  }

  const openEditModal = (client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      tier: client.tier || getTierFromSpend(client.total_spent),
      special_notes: client.special_notes || '',
      favorite_dishes: client.favorite_dishes?.join(', ') || ''
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      tier: 'silver',
      special_notes: '',
      favorite_dishes: ''
    })
  }

  const filteredClients = vipClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const clientTier = client.tier || getTierFromSpend(client.total_spent)
    const matchesTier = selectedTier === 'all' || clientTier === selectedTier
    return matchesSearch && matchesTier
  })

  const stats = {
    totalVIP: vipClients.length,
    totalRevenue: vipClients.reduce((sum, client) => sum + client.total_spent, 0),
    avgSpend: vipClients.length > 0 ? Math.round(vipClients.reduce((sum, client) => sum + client.total_spent, 0) / vipClients.length) : 0,
    totalPoints: vipClients.reduce((sum, client) => sum + (client.points || 0), 0),
    tierCounts: {
      diamond: vipClients.filter(c => (c.tier || getTierFromSpend(c.total_spent)) === 'diamond').length,
      platinum: vipClients.filter(c => (c.tier || getTierFromSpend(c.total_spent)) === 'platinum').length,
      gold: vipClients.filter(c => (c.tier || getTierFromSpend(c.total_spent)) === 'gold').length,
      silver: vipClients.filter(c => (c.tier || getTierFromSpend(c.total_spent)) === 'silver').length,
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-luxury-gold flex items-center gap-2">
            <Crown className="w-7 h-7" />
            VIP Membership Program
          </h1>
          <p className="text-luxury-gray-400 mt-1">Manage your premium customers and membership tiers</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-luxury-gray-800 text-luxury-gray-300 rounded-lg hover:bg-luxury-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg hover:bg-luxury-gold-light transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add VIP Member
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-luxury-gray-900 rounded-xl w-fit">
        {['members', 'tiers', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-luxury-gold text-luxury-black'
                : 'text-luxury-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-luxury-gold/20 rounded-xl">
              <Users className="w-6 h-6 text-luxury-gold" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-4">{stats.totalVIP}</p>
          <p className="text-sm text-luxury-gray-400">Total VIP Members</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-4">{stats.totalRevenue.toLocaleString()} MAD</p>
          <p className="text-sm text-luxury-gray-400">Total VIP Revenue</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +5%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-4">{stats.avgSpend.toLocaleString()} MAD</p>
          <p className="text-sm text-luxury-gray-400">Average Spend</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <Gift className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="flex items-center gap-1 text-red-400 text-sm">
              <ArrowDownRight className="w-4 h-4" />
              -2%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-4">{stats.totalPoints.toLocaleString()}</p>
          <p className="text-sm text-luxury-gray-400">Total Points Earned</p>
        </motion.div>
      </div>

      {/* Members Tab Content */}
      {activeTab === 'members' && (
        <>
          {/* Tier Distribution */}
          <div className="glass-card p-5 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Membership Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(VIP_TIERS).map(([key, tier]) => {
                const TierIcon = tier.icon
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTier(selectedTier === key ? 'all' : key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTier === key 
                        ? 'border-luxury-gold bg-luxury-gold/10' 
                        : 'border-luxury-gray-700 hover:border-luxury-gray-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-3`}>
                      <TierIcon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.tierCounts[key]}</p>
                    <p className={`text-sm ${tier.textColor}`}>{tier.name}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-400" />
                <input
                  type="text"
                  placeholder="Search VIP members by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-foreground placeholder:text-luxury-gray-500 focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-luxury-gray-400" />
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-4 py-2.5 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-foreground focus:outline-none focus:border-luxury-gold"
                >
                  <option value="all">All Tiers</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
              </div>
            </div>
          </div>

          {/* VIP Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredClients.map((client, index) => {
                const clientTier = client.tier || getTierFromSpend(client.total_spent)
                const tier = VIP_TIERS[clientTier]
                const TierIcon = tier.icon
                const nextTier = clientTier === 'diamond' ? null : 
                  clientTier === 'platinum' ? VIP_TIERS.diamond :
                  clientTier === 'gold' ? VIP_TIERS.platinum : VIP_TIERS.gold
                const progressToNext = nextTier 
                  ? Math.min(100, (client.total_spent / nextTier.minSpend) * 100)
                  : 100

                return (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-5 rounded-xl hover:border-luxury-gold/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {client.name}
                            <TierIcon className={`w-4 h-4 ${tier.textColor}`} />
                          </h3>
                          <div className={`flex items-center gap-2 text-sm ${tier.textColor}`}>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${tier.bgColor}`}>
                              {tier.name}
                            </span>
                            <span className="text-luxury-gray-500">|</span>
                            <span className="text-luxury-gray-400">{client.visits} visits</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(client)}
                          className="p-2 text-luxury-gray-400 hover:text-luxury-gold transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveVIP(client.id)}
                          className="p-2 text-luxury-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Spending Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-luxury-gray-400">Total Spent</span>
                        <span className="font-semibold text-foreground">{client.total_spent.toLocaleString()} MAD</span>
                      </div>
                      {nextTier && (
                        <>
                          <div className="h-2 bg-luxury-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressToNext}%` }}
                              className={`h-full bg-gradient-to-r ${tier.color}`}
                            />
                          </div>
                          <p className="text-xs text-luxury-gray-500 mt-1">
                            {(nextTier.minSpend - client.total_spent).toLocaleString()} MAD to {nextTier.name}
                          </p>
                        </>
                      )}
                      {!nextTier && (
                        <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Maximum tier achieved
                        </p>
                      )}
                    </div>

                    {/* Points */}
                    <div className="flex items-center justify-between p-3 bg-luxury-gray-800/50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-luxury-gold" />
                        <span className="text-sm text-luxury-gray-400">Loyalty Points</span>
                      </div>
                      <span className="font-semibold text-luxury-gold">{(client.points || 0).toLocaleString()}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-luxury-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-luxury-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-luxury-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(client.member_since).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Favorite Dishes */}
                    {client.favorite_dishes && client.favorite_dishes.length > 0 && (
                      <div className="pt-3 border-t border-luxury-gray-700">
                        <p className="text-xs text-luxury-gray-500 mb-2 flex items-center gap-1">
                          <ChefHat className="w-3 h-3" /> Favorite Dishes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {client.favorite_dishes.map((dish, i) => (
                            <span key={i} className="px-2 py-1 bg-luxury-gray-800 text-luxury-gray-300 text-xs rounded-full">
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Notes */}
                    {client.special_notes && (
                      <div className="pt-3 mt-3 border-t border-luxury-gray-700">
                        <p className="text-xs text-luxury-gray-500 mb-1">Special Notes</p>
                        <p className="text-sm text-luxury-gray-300">{client.special_notes}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-luxury-gray-700 flex items-center justify-between">
                      <span className="text-xs text-luxury-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last visit: {new Date(client.last_visit).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredClients.length === 0 && (
            <div className="glass-card p-8 rounded-xl text-center">
              <Crown className="w-12 h-12 text-luxury-gray-600 mx-auto mb-3" />
              <p className="text-luxury-gray-400">No VIP members found</p>
            </div>
          )}
        </>
      )}

      {/* Tiers Tab Content */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(VIP_TIERS).map(([key, tier]) => {
            const TierIcon = tier.icon
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                    <TierIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${tier.textColor}`}>{tier.name} Tier</h3>
                    <p className="text-luxury-gray-400">Min. spend: {tier.minSpend.toLocaleString()} MAD</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-luxury-gray-300 mb-2">Benefits Include:</p>
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full ${tier.bgColor} flex items-center justify-center`}>
                        <Check className={`w-3 h-3 ${tier.textColor}`} />
                      </div>
                      <span className="text-luxury-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-luxury-gray-700 flex items-center justify-between">
                  <span className="text-sm text-luxury-gray-400">{stats.tierCounts[key]} members</span>
                  <button className="text-sm text-luxury-gold hover:text-luxury-gold-light transition-colors">
                    View Members
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Tier</h3>
            <div className="space-y-4">
              {Object.entries(VIP_TIERS).reverse().map(([key, tier]) => {
                const tierRevenue = vipClients
                  .filter(c => (c.tier || getTierFromSpend(c.total_spent)) === key)
                  .reduce((sum, c) => sum + c.total_spent, 0)
                const percentage = stats.totalRevenue > 0 ? (tierRevenue / stats.totalRevenue) * 100 : 0
                
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${tier.textColor}`}>{tier.name}</span>
                      <span className="text-sm text-luxury-gray-400">{tierRevenue.toLocaleString()} MAD ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-luxury-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${tier.color}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Wine className="w-5 h-5 text-luxury-gold" />
                Top Spenders
              </h3>
              <div className="space-y-3">
                {[...vipClients].sort((a, b) => b.total_spent - a.total_spent).slice(0, 5).map((client, i) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-luxury-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-gray-700 text-luxury-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-foreground">{client.name}</span>
                    </div>
                    <span className="font-semibold text-luxury-gold">{client.total_spent.toLocaleString()} MAD</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-luxury-gold" />
                Most Frequent Visitors
              </h3>
              <div className="space-y-3">
                {[...vipClients].sort((a, b) => b.visits - a.visits).slice(0, 5).map((client, i) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-luxury-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-gray-700 text-luxury-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-foreground">{client.name}</span>
                    </div>
                    <span className="font-semibold text-purple-400">{client.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddModal(false)
              setShowEditModal(false)
              setSelectedClient(null)
              resetForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 rounded-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {showAddModal ? 'Add VIP Member' : 'Edit VIP Member'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedClient(null)
                    resetForm()
                  }}
                  className="p-2 text-luxury-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={showAddModal ? handleAddVIP : handleEditVIP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="luxury-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="luxury-input"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="luxury-input"
                      placeholder="+212 6XX-XXXXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Membership Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="luxury-select"
                  >
                    {Object.entries(VIP_TIERS).map(([key, tier]) => (
                      <option key={key} value={key}>{tier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Favorite Dishes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.favorite_dishes}
                    onChange={(e) => setFormData({ ...formData, favorite_dishes: e.target.value })}
                    className="luxury-input"
                    placeholder="Pastilla, Tagine, Couscous..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-gray-300 mb-2">Special Notes</label>
                  <textarea
                    value={formData.special_notes}
                    onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                    className="luxury-input resize-none h-24"
                    placeholder="Allergies, seating preferences, special occasions..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedClient(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-3 border border-luxury-gray-700 text-luxury-gray-300 rounded-lg hover:bg-luxury-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-colors"
                  >
                    {showAddModal ? 'Add Member' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
