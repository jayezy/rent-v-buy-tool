import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number
}

const directionClasses = {
  up: { hidden: 'translate-y-8', visible: 'translate-y-0' },
  down: { hidden: '-translate-y-8', visible: 'translate-y-0' },
  left: { hidden: 'translate-x-8', visible: 'translate-x-0' },
  right: { hidden: '-translate-x-8', visible: 'translate-x-0' },
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const dir = directionClasses[direction]

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? `opacity-100 ${dir.visible}` : `opacity-0 ${dir.hidden}`
      } ${className}`}
    >
      {children}
    </div>
  )
}
