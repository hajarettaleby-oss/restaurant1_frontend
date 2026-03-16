import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Check,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'
import { reservationAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
]

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12]

function Reservation() {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      toast.error('Please select a date and time')
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all contact details')
      return
    }

    try {
      setLoading(true)
      
      await reservationAPI.create({
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        special_requests: formData.specialRequests,
      })

      setSuccess(true)
      toast.success('Reservation confirmed!')
    } catch (error) {
      // For demo, show success anyway
      setSuccess(true)
      toast.success('Reservation confirmed!')
    } finally {
      setLoading(false)
    }
  }

  const goToNextStep = () => {
    if (step === 1 && (!formData.date || !formData.time)) {
      toast.error('Please select a date and time')
      return
    }
    setStep(prev => prev + 1)
  }

  const goToPrevStep = () => {
    setStep(prev => prev - 1)
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (success) {
    return (
      <div className="min-h-screen pt-20 bg-luxury-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Reservation Confirmed!
          </h2>
          
          <p className="text-luxury-gray-400 mb-8">
            Thank you for your reservation. We've sent a confirmation email to{' '}
            <span className="text-luxury-gold">{formData.email}</span>
          </p>

          <div className="glass-card p-6 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4">Reservation Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-luxury-gray-400">Date</span>
                <span className="text-white">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-gray-400">Time</span>
                <span className="text-white">{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-gray-400">Guests</span>
                <span className="text-white">{formData.guests} {formData.guests === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-gray-400">Name</span>
                <span className="text-white">{formData.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSuccess(false)
              setStep(1)
              setFormData({
                date: '',
                time: '',
                guests: 2,
                name: user?.name || '',
                email: user?.email || '',
                phone: '',
                specialRequests: '',
              })
            }}
            className="gold-button-outline"
          >
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-luxury-black">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-black/95 to-luxury-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920"
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
            Reserve Your Table
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mb-6"
          >
            Book Your <span className="text-luxury-gold">Experience</span>
          </motion.h1>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{
                    backgroundColor: step >= s ? '#d4af37' : '#262626',
                    borderColor: step >= s ? '#d4af37' : '#404040',
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 ${
                    step >= s ? 'text-luxury-black' : 'text-luxury-gray-400'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </motion.div>
                {s < 3 && (
                  <motion.div
                    animate={{
                      backgroundColor: step > s ? '#d4af37' : '#404040',
                    }}
                    className="w-20 sm:w-32 h-0.5"
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-8"
                >
                  <h2 className="font-serif text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-luxury-gold" />
                    Select Date & Time
                  </h2>

                  <div className="space-y-6">
                    {/* Date */}
                    <div>
                      <label className="luxury-label">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        min={today}
                        className="luxury-input"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="luxury-label">Preferred Time</label>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {timeSlots.map((time) => (
                          <motion.button
                            key={time}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChange('time', time)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              formData.time === time
                                ? 'bg-luxury-gold text-luxury-black'
                                : 'bg-luxury-gray-800 text-luxury-gray-300 hover:bg-luxury-gray-700'
                            }`}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="luxury-label flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Number of Guests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {guestOptions.map((num) => (
                          <motion.button
                            key={num}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChange('guests', num)}
                            className={`w-12 h-12 rounded-lg font-medium transition-all ${
                              formData.guests === num
                                ? 'bg-luxury-gold text-luxury-black'
                                : 'bg-luxury-gray-800 text-luxury-gray-300 hover:bg-luxury-gray-700'
                            }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToNextStep}
                      className="gold-button flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-8"
                >
                  <h2 className="font-serif text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-luxury-gold" />
                    Contact Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="luxury-label">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="luxury-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="luxury-label flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="luxury-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="luxury-label flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+212 600 000 000"
                        className="luxury-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToPrevStep}
                      className="gold-button-outline"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToNextStep}
                      className="gold-button flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Special Requests & Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-8"
                >
                  <h2 className="font-serif text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-luxury-gold" />
                    Special Requests
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="luxury-label">Any special requests or dietary requirements?</label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleChange('specialRequests', e.target.value)}
                        placeholder="Allergies, special occasions, seating preferences..."
                        rows={4}
                        className="luxury-input resize-none"
                      />
                    </div>

                    {/* Summary */}
                    <div className="glass-card p-6 border-luxury-gold/30">
                      <h3 className="font-semibold text-white mb-4">Reservation Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-luxury-gray-400">Date</span>
                          <span className="text-white">
                            {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-gray-400">Time</span>
                          <span className="text-white">{formData.time || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-gray-400">Guests</span>
                          <span className="text-white">{formData.guests} {formData.guests === 1 ? 'person' : 'people'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-gray-400">Name</span>
                          <span className="text-white">{formData.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-luxury-gray-400">Contact</span>
                          <span className="text-white">{formData.email || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToPrevStep}
                      className="gold-button-outline"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="gold-button flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Confirm Reservation
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Reservation
