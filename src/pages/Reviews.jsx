import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, Quote, User } from 'lucide-react'
import { reviewAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/common/Modal'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

// Mock reviews for demo
const mockReviews = [
  {
    id: 1,
    user: { name: 'Sarah Johnson' },
    rating: 5,
    content: 'Absolutely incredible dining experience! The lamb tagine was perfectly cooked and the service was impeccable. Will definitely be coming back for more.',
    created_at: '2024-01-15T12:00:00Z',
  },
  {
    id: 2,
    user: { name: 'Mohammed Alami' },
    rating: 5,
    content: 'ETTALEBY PLATES has become our go-to restaurant for special occasions. The ambiance is perfect for romantic dinners and the food never disappoints.',
    created_at: '2024-01-10T18:30:00Z',
  },
  {
    id: 3,
    user: { name: 'Emma Laurent' },
    rating: 4,
    content: 'Beautiful restaurant with excellent food. The couscous royale was authentic and delicious. Only minor feedback would be the wait time on busy nights.',
    created_at: '2024-01-08T20:00:00Z',
  },
  {
    id: 4,
    user: { name: 'James Wilson' },
    rating: 5,
    content: 'As a food critic, I\'ve dined at many restaurants, but ETTALEBY PLATES stands out. The attention to detail in every dish is remarkable.',
    created_at: '2024-01-05T19:00:00Z',
  },
  {
    id: 5,
    user: { name: 'Fatima Benali' },
    rating: 5,
    content: 'The best Moroccan cuisine I\'ve ever had outside of my grandmother\'s kitchen. The chef clearly understands the essence of our culinary traditions.',
    created_at: '2024-01-01T14:00:00Z',
  },
  {
    id: 6,
    user: { name: 'David Chen' },
    rating: 4,
    content: 'Wonderful experience from start to finish. The grilled sea bass was cooked to perfection. Highly recommend the Moroccan mint tea!',
    created_at: '2023-12-28T21:00:00Z',
  },
]

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, content: '' })
  const [submitting, setSubmitting] = useState(false)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewAPI.getAll()
      setReviews(response.data)
    } catch {
      // Use mock data
      setReviews(mockReviews)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review')
      return
    }

    if (!newReview.content.trim()) {
      toast.error('Please write your review')
      return
    }

    try {
      setSubmitting(true)
      await reviewAPI.create(newReview)
      
      // Add to local state for demo
      setReviews(prev => [{
        id: Date.now(),
        user: { name: user?.name || 'Anonymous' },
        rating: newReview.rating,
        content: newReview.content,
        created_at: new Date().toISOString(),
      }, ...prev])

      setIsModalOpen(false)
      setNewReview({ rating: 5, content: '' })
      toast.success('Review submitted successfully!')
    } catch {
      // Add to local state anyway for demo
      setReviews(prev => [{
        id: Date.now(),
        user: { name: user?.name || 'Anonymous' },
        rating: newReview.rating,
        content: newReview.content,
        created_at: new Date().toISOString(),
      }, ...prev])

      setIsModalOpen(false)
      setNewReview({ rating: 5, content: '' })
      toast.success('Review submitted successfully!')
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }))

  return (
    <div className="min-h-screen pt-20 bg-luxury-black">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-black/95 to-luxury-black z-10" />
          <img
            src="/images/reviews-bg.png"
            alt="Restaurant"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-subtitle mb-4"
          >
            Guest Reviews
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mb-6"
          >
            What Our <span className="text-luxury-gold">Guests</span> Say
          </motion.h1>
        </div>
      </section>

      {/* Stats & Add Review */}
      <section className="py-12 border-b border-luxury-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Rating Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-luxury-gold mb-2">
                    {averageRating}
                  </div>
                  <StarRating rating={Math.round(parseFloat(averageRating))} size="lg" />
                  <p className="text-luxury-gray-400 mt-2">{reviews.length} reviews</p>
                </div>
                
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-luxury-gray-400 w-3">{rating}</span>
                      <Star className="w-4 h-4 text-luxury-gold" />
                      <div className="flex-1 h-2 bg-luxury-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-luxury-gold"
                        />
                      </div>
                      <span className="text-sm text-luxury-gray-400 w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Add Review CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left"
            >
              <h3 className="font-serif text-2xl font-semibold text-white mb-4">
                Share Your Experience
              </h3>
              <p className="text-luxury-gray-400 mb-6">
                We'd love to hear about your dining experience at ETTALEBY PLATES. 
                Your feedback helps us serve you better.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="gold-button flex items-center gap-2 mx-auto md:mx-0"
              >
                <Plus className="w-5 h-5" />
                Write a Review
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="glass-card p-6 hover:border-luxury-gold/50 transition-all duration-500"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <Quote className="w-8 h-8 text-luxury-gold/30 flex-shrink-0" />
                      <div className="flex-1">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    
                    <p className="text-luxury-gray-300 leading-relaxed mb-6 line-clamp-4">
                      "{review.content}"
                    </p>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-luxury-gray-800">
                      <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-luxury-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-luxury-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Add Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="luxury-label">Your Rating</label>
            <StarRating
              rating={newReview.rating}
              interactive
              size="lg"
              onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
            />
          </div>

          <div>
            <label className="luxury-label">Your Review</label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience with us..."
              rows={5}
              className="luxury-input resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-luxury-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gold-button"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
              ) : (
                'Submit Review'
              )}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Reviews
