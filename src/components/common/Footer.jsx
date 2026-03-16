import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Send,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Thank you for subscribing!')
    setEmail('')
    setLoading(false)
  }

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Reservation', path: '/reservation' },
    { label: 'Reviews', path: '/reviews' },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ]

  return (
    <footer className="bg-luxury-gray-900 border-t border-luxury-gray-800">
      {/* Newsletter Section */}
      <div className="border-b border-luxury-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-luxury-gray-400">
                Get exclusive offers, new menu updates, and special event invitations.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="luxury-input flex-1"
                required
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="gold-button flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <NavLink to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-luxury-gold flex items-center justify-center">
                <span className="font-serif font-bold text-luxury-black text-2xl">E</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl text-white">ETTALEBY</h1>
                <p className="text-xs text-luxury-gold tracking-widest">PLATES</p>
              </div>
            </NavLink>
            <p className="text-luxury-gray-400 mb-6 leading-relaxed">
              Experience culinary excellence at its finest. Where every dish tells a story 
              of passion, tradition, and innovation.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-luxury-gray-800 flex items-center justify-center text-luxury-gray-400 hover:text-luxury-gold hover:bg-luxury-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="group flex items-center gap-2 text-luxury-gray-400 hover:text-luxury-gold transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <span className="text-luxury-gray-400">
                  123 Mohammed V Avenue<br />
                  Benguerir, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <a href="tel:+212600000000" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors">
                  +212 600 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <a href="mailto:info@ettaleby.com" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors">
                  info@ettaleby.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-6">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <div className="text-luxury-gray-400">
                  <p className="font-medium text-white">Monday - Friday</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <div className="text-luxury-gray-400">
                  <p className="font-medium text-white">Saturday - Sunday</p>
                  <p>10:00 AM - 12:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-luxury-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} ETTALEBY PLATES. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="text-sm text-luxury-gray-500 hover:text-luxury-gold transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
