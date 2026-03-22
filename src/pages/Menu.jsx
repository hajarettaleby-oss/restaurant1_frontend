import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronDown, Plus, Heart, X } from 'lucide-react'
import { menuAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { MenuCardSkeleton } from '../components/common/Skeleton'
import Modal from '../components/common/Modal'
import toast from 'react-hot-toast'

// Mock categories for demo
const mockCategories = [
  { id: 1, name: 'All', slug: 'all' },
  { id: 2, name: 'Appetizers', slug: 'appetizers' },
  { id: 3, name: 'Main Course', slug: 'main-course' },
  { id: 4, name: 'Seafood', slug: 'seafood' },
  { id: 5, name: 'Desserts', slug: 'desserts' },
  { id: 6, name: 'Beverages', slug: 'beverages' },
]

// Mock menu items for demo
const mockMenuItems = [
  {
    id: 1,
    name: 'Moroccan Harira Soup',
    description: 'Traditional Moroccan soup with tomatoes, lentils, chickpeas, and fresh herbs',
    price: 65,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
    is_available: true,
    preparation_time: 15,
  },
  {
    id: 2,
    name: 'Lamb Tagine',
    description: 'Slow-cooked lamb with apricots, almonds, and aromatic spices',
    price: 185,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600',
    is_available: true,
    preparation_time: 45,
  },
  {
    id: 3,
    name: 'Grilled Sea Bass',
    description: 'Fresh sea bass with chermoula sauce and seasonal vegetables',
    price: 220,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    is_available: true,
    preparation_time: 30,
  },
  {
    id: 4,
    name: 'Couscous Royale',
    description: 'Seven-vegetable couscous with lamb, chicken, and merguez',
    price: 165,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    is_available: true,
    preparation_time: 40,
  },
  {
    id: 5,
    name: 'Pastilla au Pigeon',
    description: 'Traditional Moroccan pie with pigeon, almonds, and cinnamon',
    price: 145,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    is_available: true,
    preparation_time: 25,
  },
  {
    id: 6,
    name: 'Moroccan Mint Tea',
    description: 'Traditional green tea with fresh mint leaves',
    price: 35,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600',
    is_available: true,
    preparation_time: 5,
  },
  {
    id: 7,
    name: 'Orange Blossom Crème Brûlée',
    description: 'Classic crème brûlée infused with orange blossom water',
    price: 75,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600',
    is_available: true,
    preparation_time: 15,
  },
  {
    id: 8,
    name: 'Grilled Prawns',
    description: 'Tiger prawns with garlic butter and fresh herbs',
    price: 195,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600',
    is_available: true,
    preparation_time: 20,
  },
]

function Menu() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState(mockCategories)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useState([])
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

const fetchMenuItems = async () => {
  try {
    setLoading(true)

    const response = await menuAPI.getItems()

    setItems(response.data)
  } catch (error) {
    console.error('Failed to fetch menu items:', error)
  } finally {
    setLoading(false)
  }
}
  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories()
      setCategories([{ id: 0, name: 'All', slug: 'all' }, ...response.data])
    } catch {
      // Use mock categories
    }
  }

  const handleAddToCart = async (item) => {
    const result = await addToCart(item)
    if (result.success) {
      // Animate the add to cart
    }
  }

  const toggleFavorite = (itemId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return
    }
    
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
    toast.success(favorites.includes(itemId) ? 'Removed from favorites' : 'Added to favorites')
  }

const filteredItems = items
  .filter(item => {
    const matchesCategory =
      selectedCategory === 0 || item.category_id === selectedCategory

    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })
  .sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen pt-20 bg-luxury-black">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-black/95 to-luxury-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920"
            alt="Restaurant interior"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-subtitle mb-4"
          >
            Our Menu
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mb-6"
          >
            Culinary <span className="text-luxury-gold">Masterpieces</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-luxury-gray-400 max-w-2xl mx-auto"
          >
            Discover our exquisite selection of dishes, crafted with passion 
            and the finest ingredients.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-luxury-gray-800 sticky top-20 bg-luxury-black/95 backdrop-blur-lg z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              {categories.map((category) => (
                <motion.button
                  key={category.slug}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-luxury-gold text-luxury-black'
                      : 'bg-luxury-gray-800 text-luxury-gray-300 hover:bg-luxury-gray-700'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-500" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="luxury-input pl-10"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="luxury-select pr-10 appearance-none"
                >
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-gray-400 text-lg">No dishes found matching your criteria.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="menu-card group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={
  item.image_url
    ? `http://localhost:8000/storage/${item.image_url}`
    : '/images/food/salad.png'
}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-luxury-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            favorites.includes(item.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-white'
                          }`} 
                        />
                      </motion.button>

                      {/* Category Badge */}
                     <span className="absolute bottom-3 left-3 badge-gold capitalize">
  {
    (item.category?.name ||
     item.category?.slug ||
     item.category ||
     'unknown'
    ).toString().replace('-', ' ')
  }
</span>
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-luxury-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-luxury-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl font-bold text-luxury-gold">
                        {item.price} MAD
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(item)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg font-medium text-sm hover:bg-luxury-gold-light transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-64 object-cover rounded-xl"
            />
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-gold capitalize">
                  {
  (selectedItem.category?.name ||
   selectedItem.category ||
   'unknown'
  ).toString()
}
                </span>
                <span className="text-sm text-luxury-gray-400">
                  Prep time: {selectedItem.preparation_time} min
                </span>
              </div>
              
              <p className="text-luxury-gray-300 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-luxury-gray-800">
              <span className="font-serif text-3xl font-bold text-luxury-gold">
                {selectedItem.price} MAD
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleAddToCart(selectedItem)
                  setSelectedItem(null)
                }}
                className="gold-button flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </motion.button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Menu
