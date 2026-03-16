import { motion } from 'framer-motion'

function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'bg-luxury-gray-800 overflow-hidden relative'
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-luxury-gray-700/50 to-transparent"
        animate={{ translateX: ['−100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function MenuCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-10 rounded-lg" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-luxury-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton variant="text" className="w-full" />
        </td>
      ))}
    </tr>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-16 h-6" />
      </div>
      <Skeleton variant="text" className="w-1/2 mb-2" />
      <Skeleton className="w-24 h-8" />
    </div>
  )
}

export default Skeleton
