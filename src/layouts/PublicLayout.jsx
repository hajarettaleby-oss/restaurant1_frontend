import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black dark:bg-luxury-black">
      <Navbar />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

export default PublicLayout
