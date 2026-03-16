import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ChefHat, 
  Award, 
  Clock, 
  Users, 
  ArrowRight, 
  Star,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import AnimatedCounter from '../components/common/AnimatedCounter'
import StarRating from '../components/common/StarRating'

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Critic',
    content: 'An extraordinary dining experience. The attention to detail in every dish is remarkable. Truly a culinary masterpiece.',
    rating: 5,
    image: '/images/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Mohammed Alami',
    role: 'Regular Guest',
    content: 'ETTALEBY PLATES has become our family\'s favorite restaurant. The ambiance, service, and food are consistently exceptional.',
    rating: 5,
    image: '/images/testimonial-2.jpg',
  },
  {
    id: 3,
    name: 'Emma Laurent',
    role: 'Travel Blogger',
    content: 'A hidden gem in Benguerir! The fusion of traditional Moroccan flavors with modern techniques is simply brilliant.',
    rating: 5,
    image: '/images/testimonial-3.jpg',
  },
]

const stats = [
  { label: 'Years of Excellence', value: 15, suffix: '+' },
  { label: 'Dishes Served', value: 50000, suffix: '+' },
  { label: 'Happy Guests', value: 10000, suffix: '+' },
  { label: 'Awards Won', value: 25, suffix: '' },
]

const features = [
  {
    icon: ChefHat,
    title: 'Master Chefs',
    description: 'Our award-winning chefs bring decades of culinary expertise to every dish.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We source only the finest ingredients from local and international suppliers.',
  },
  {
    icon: Clock,
    title: 'Perfect Timing',
    description: 'Every dish is prepared fresh and served at the perfect moment.',
  },
  {
    icon: Users,
    title: 'VIP Experience',
    description: 'Exclusive perks and personalized service for our valued guests.',
  },
]

function Home() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/50 to-luxury-black z-10" />
          <img
            src="/images/hero-restaurant.png"
            alt="Fine dining"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-32 h-32 border border-luxury-gold/20 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-20 h-20 border border-luxury-gold/30 rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero Content */}
        <motion.div 
          className="relative z-20 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section-subtitle mb-6"
          >
            Welcome to ETTALEBY PLATES
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Experience
            <span className="block text-gradient-gold">Culinary Excellence</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-luxury-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Embark on a gastronomic journey where tradition meets innovation. 
            Every dish tells a story of passion, craftsmanship, and the finest ingredients.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <NavLink to="/menu" className="gold-button flex items-center gap-2 text-lg">
              View Menu
              <ArrowRight className="w-5 h-5" />
            </NavLink>
            <NavLink to="/reservation" className="gold-button-outline flex items-center gap-2 text-lg">
              Reserve Table
              <Calendar className="w-5 h-5" />
            </NavLink>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-luxury-gold rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-luxury-gold rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-luxury-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="section-subtitle mb-4">Our Story</p>
              <h2 className="section-title mb-6">
                A Legacy of
                <span className="text-luxury-gold"> Taste</span>
              </h2>
              <p className="text-luxury-gray-400 leading-relaxed mb-6">
                Founded in 2009, ETTALEBY PLATES has been serving the finest cuisine 
                in Benguerir, Morocco. Our commitment to excellence has made us a 
                destination for food lovers from around the world.
              </p>
              <p className="text-luxury-gray-400 leading-relaxed mb-8">
                Every dish that leaves our kitchen is a testament to our dedication 
                to quality, creativity, and the rich culinary traditions of Morocco 
                combined with contemporary techniques.
              </p>
              <NavLink to="/menu" className="gold-button-outline inline-flex items-center gap-2">
                Explore Our Menu
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="/images/about-restaurant.png"
                  alt="Chef preparing dish"
                  className="rounded-2xl shadow-luxury"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-64 h-64 border-2 border-luxury-gold/30 rounded-2xl" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-luxury-gold/10 rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-luxury-gray-900 border-y border-luxury-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-luxury-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-subtitle mb-4"
            >
              Why Choose Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              The <span className="text-luxury-gold">ETTALEBY</span> Difference
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-8 text-center group hover:border-luxury-gold/50 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-luxury-gold/10 flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-luxury-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Showcase */}
      <section className="py-24 bg-luxury-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <img
                src="/images/chef.png"
                alt="Head Chef"
                className="rounded-2xl shadow-luxury"
              />
              <div className="absolute -bottom-6 -right-6 glass-card p-6 border-luxury-gold/30">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-luxury-gold" />
                  <span className="text-luxury-gold font-semibold">Master Chef</span>
                </div>
                <p className="text-white font-serif text-lg">Ahmed El Mansouri</p>
                <p className="text-luxury-gray-400 text-sm">20+ Years Experience</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <p className="section-subtitle mb-4">Meet Our Chef</p>
              <h2 className="section-title mb-6">
                Crafting <span className="text-luxury-gold">Perfection</span>
              </h2>
              <p className="text-luxury-gray-400 leading-relaxed mb-6">
                Chef Ahmed El Mansouri brings over two decades of culinary expertise 
                to ETTALEBY PLATES. Trained in the finest kitchens of Paris and Marrakech, 
                he seamlessly blends French techniques with authentic Moroccan flavors.
              </p>
              <p className="text-luxury-gray-400 leading-relaxed mb-8">
                His philosophy is simple: respect the ingredients, honor the traditions, 
                and create dishes that tell a story. Every plate that leaves his kitchen 
                is a work of art.
              </p>
              <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-luxury-gold" />
                <span className="text-luxury-gray-300">Michelin Star Trained</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VIP Section */}
      <section className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxury-gold rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-12 md:p-16 text-center border-luxury-gold/30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                <Star className="w-10 h-10 text-luxury-gold" />
              </div>
              <p className="section-subtitle mb-4">Exclusive Membership</p>
              <h2 className="section-title mb-6">
                Join Our <span className="text-luxury-gold">VIP Club</span>
              </h2>
              <p className="text-luxury-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                Unlock exclusive benefits including priority reservations, special menu access, 
                complimentary tastings, and personalized dining experiences designed just for you.
              </p>
              <NavLink to="/register" className="gold-button inline-flex items-center gap-2 text-lg">
                Become a VIP
                <ArrowRight className="w-5 h-5" />
              </NavLink>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-luxury-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-subtitle mb-4"
            >
              Testimonials
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              What Our <span className="text-luxury-gold">Guests</span> Say
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-8 hover:border-luxury-gold/50 transition-all duration-500"
              >
                <StarRating rating={testimonial.rating} className="mb-4" />
                <p className="text-luxury-gray-300 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                    <span className="font-serif font-bold text-luxury-gold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-luxury-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Preview */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="section-subtitle mb-4">Book Your Table</p>
              <h2 className="section-title mb-6">
                Reserve Your
                <span className="text-luxury-gold"> Experience</span>
              </h2>
              <p className="text-luxury-gray-400 leading-relaxed mb-8">
                Whether it's an intimate dinner for two or a grand celebration, 
                we're ready to make your evening unforgettable. Book your table 
                today and let us take care of the rest.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-luxury-gold" />
                  <span className="text-luxury-gray-300">Open Daily: 11:00 AM - 12:00 AM</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-luxury-gold" />
                  <span className="text-luxury-gray-300">123 Mohammed V Avenue, Benguerir</span>
                </div>
              </div>
              <NavLink to="/reservation" className="gold-button inline-flex items-center gap-2">
                Make Reservation
                <Calendar className="w-5 h-5" />
              </NavLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[400px] rounded-2xl overflow-hidden border border-luxury-gray-800"
            >
              <MapContainer
                center={[32.2333, -7.9500]}
                zoom={14}
                className="w-full h-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[32.2333, -7.9500]}>
                  <Popup>
                    <strong>ETTALEBY PLATES</strong><br />
                    123 Mohammed V Avenue<br />
                    Benguerir, Morocco
                  </Popup>
                </Marker>
              </MapContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-luxury-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-subtitle mb-4"
            >
              Gallery
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Visual <span className="text-luxury-gold">Journey</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/images/gallery/dish-1.png',
              '/images/gallery/dish-2.png',
              '/images/gallery/dish-3.png',
              '/images/gallery/dish-4.png',
              '/images/gallery/dish-5.png',
              '/images/gallery/dish-6.png',
              '/images/gallery/dish-7.png',
              '/images/gallery/dish-8.png',
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`relative overflow-hidden rounded-xl ${
                  index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-luxury-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
