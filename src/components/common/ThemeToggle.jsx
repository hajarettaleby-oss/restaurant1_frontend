import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function ThemeToggle({ showLabel = false }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
        showLabel 
          ? 'w-full px-4 py-3 hover:bg-luxury-gray-800' 
          : 'hover:bg-luxury-gray-800'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 0 : 180,
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5 text-luxury-gold" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? -180 : 0,
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5 text-luxury-gold" />
        </motion.div>
      </div>
      {showLabel && (
        <span className="text-luxury-gray-400">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </motion.button>
  )
}

export default ThemeToggle
