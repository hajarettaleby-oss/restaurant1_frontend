import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < rating
        
        return (
          <motion.button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                filled 
                  ? 'fill-luxury-gold text-luxury-gold' 
                  : 'text-luxury-gray-600'
              } ${interactive && !filled ? 'hover:text-luxury-gold/50' : ''}`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

export default StarRating
