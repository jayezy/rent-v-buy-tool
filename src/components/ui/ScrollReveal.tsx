import { useRef, type ReactNode } from 'react'
import { useInView } from 'motion/react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number
}

const directionStyles = {
  up: { hidden: 'translateY(24px)', visible: 'translateY(0)' },
  down: { hidden: 'translateY(-24px)', visible: 'translateY(0)' },
  left: { hidden: 'translateX(24px)', visible: 'translateX(0)' },
  right: { hidden: 'translateX(-24px)', visible: 'translateX(0)' },
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })

  const dir = directionStyles[direction]

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? dir.visible : dir.hidden,
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
