import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

function AnimatedCounter({ value, duration = 2, prefix = '', suffix = '', decimals = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`
  })

  useEffect(() => {
    if (isVisible) {
      spring.set(value)
    }
  }, [spring, value, isVisible])

  return (
    <motion.span
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  )
}

export default AnimatedCounter
