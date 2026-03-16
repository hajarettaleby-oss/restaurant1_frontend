import { useState, useEffect } from 'react'
import { reviewAPI } from '../../services/api'
import { Star, Trash2, Eye, EyeOff, MessageSquare, User, Calendar, Search, Filter } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    published: 0,
    pending: 0
  })

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await reviewAPI.getAll({ status: filter !== 'all' ? filter : undefined })
      const data = response.data || []
      setReviews(data)
      
      // Calculate stats
      const total = data.length
      const avgRating = total > 0 ? (data.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0
      const published = data.filter(r => r.status === 'published').length
      const pending = data.filter(r => r.status === 'pending').length
      
      setStats({ total, avgRating, published, pending })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Mock data for demonstration
      const mockReviews = [
        { id: 1, user_name: 'Ahmed Ben Ali', rating: 5, comment: 'Exceptional dining experience! The lamb tagine was perfectly cooked.', status: 'published', created_at: '2024-01-15T19:30:00Z' },
        { id: 2, user_name: 'Fatima Zahra', rating: 4, comment: 'Beautiful ambiance and great service. Will definitely come back.', status: 'published', created_at: '2024-01-14T20:15:00Z' },
        { id: 3, user_name: 'Omar Hassan', rating: 5, comment: 'Best Moroccan restaurant in the city. Highly recommend the couscous royal.', status: 'pending', created_at: '2024-01-13T18:45:00Z' },
        { id: 4, user_name: 'Layla Bennis', rating: 3, comment: 'Good food but service was a bit slow during peak hours.', status: 'published', created_at: '2024-01-12T21:00:00Z' },
        { id: 5, user_name: 'Youssef Alami', rating: 5, comment: 'Outstanding! The pastilla was divine and the mint tea was refreshing.', status: 'pending', created_at: '2024-01-11T19:00:00Z' },
      ]
      setReviews(mockReviews)
      setStats({
        total: mockReviews.length,
        avgRating: (mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length).toFixed(1),
        published: mockReviews.filter(r => r.status === 'published').length,
        pending: mockReviews.filter(r => r.status === 'pending').length
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'pending' : 'published'
    try {
      await reviewAPI.updateStatus(reviewId, newStatus)
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: newStatus } : r
      ))
    } catch (error) {
      console.error('Error updating review status:', error)
      // Update locally for demo
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: newStatus } : r
      ))
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    
    try {
      await reviewAPI.delete(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
      // Delete locally for demo
      setReviews(reviews.filter(r => r.id !== reviewId))
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-luxury-gold fill-luxury-gold' : 'text-luxury-gray-600'}`}
      />
    ))
  }

  const filteredReviews = reviews.filter(review =>
    review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reviews Management</h1>
        <p className="text-luxury-gray-400 mt-1">Monitor and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-gold/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Total Reviews</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Average Rating</p>
              <p className="text-xl font-bold text-white">{stats.avgRating}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Published</p>
              <p className="text-xl font-bold text-white">{stats.published}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <EyeOff className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-luxury-gray-400 text-sm">Pending</p>
              <p className="text-xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-white placeholder:text-luxury-gray-500 focus:outline-none focus:border-luxury-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-luxury-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-luxury-black/50 border border-luxury-gray-700 rounded-lg text-white focus:outline-none focus:border-luxury-gold"
            >
              <option value="all">All Reviews</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full mx-auto"></div>
            <p className="text-luxury-gray-400 mt-4">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <MessageSquare className="w-12 h-12 text-luxury-gray-600 mx-auto mb-4" />
            <p className="text-luxury-gray-400">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="glass-card p-6 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{review.user_name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-luxury-gray-400 text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-luxury-gray-300 mt-3">{review.comment}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {review.status}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(review.id, review.status)}
                    className="p-2 hover:bg-luxury-gray-800 rounded-lg transition-colors"
                    title={review.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {review.status === 'published' ? (
                      <EyeOff className="w-5 h-5 text-luxury-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
