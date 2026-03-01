import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'
import ScrollReveal from '../ui/ScrollReveal'

interface ComparisonItem {
  category: string
  renting: { title: string; description: string; sentiment: 'positive' | 'neutral' | 'negative' }
  buying: { title: string; description: string; sentiment: 'positive' | 'neutral' | 'negative' }
}

const COMPARISONS: ComparisonItem[] = [
  {
    category: 'Monthly Costs',
    renting: {
      title: 'Predictable payments',
      description: 'Fixed for your lease term — no surprise repair bills.',
      sentiment: 'positive',
    },
    buying: {
      title: 'Potentially lower long-term',
      description: 'Fixed mortgage, but taxes, insurance, and maintenance add up.',
      sentiment: 'neutral',
    },
  },
  {
    category: 'Upfront Costs',
    renting: {
      title: 'Low barrier to entry',
      description: 'First month, last month, and a security deposit.',
      sentiment: 'positive',
    },
    buying: {
      title: 'Significant cash outlay',
      description: 'Down payment (3–20%), closing costs (2–5%), and more.',
      sentiment: 'negative',
    },
  },
  {
    category: 'Maintenance',
    renting: {
      title: 'Landlord handles it',
      description: 'Broken furnace? Not your problem or your bill.',
      sentiment: 'positive',
    },
    buying: {
      title: 'You are responsible',
      description: 'Budget 1–2% of home value annually for upkeep.',
      sentiment: 'negative',
    },
  },
  {
    category: 'Wealth Building',
    renting: {
      title: 'Invest the difference',
      description: 'Spare cash can grow in index funds or other investments.',
      sentiment: 'neutral',
    },
    buying: {
      title: 'Build equity over time',
      description: 'Each payment builds ownership. Homes appreciate 2–4% annually.',
      sentiment: 'positive',
    },
  },
  {
    category: 'Flexibility',
    renting: {
      title: 'Easy to relocate',
      description: 'Move for a new job or city with minimal friction.',
      sentiment: 'positive',
    },
    buying: {
      title: 'Harder to move quickly',
      description: 'Selling takes months and costs 5–6% in agent fees.',
      sentiment: 'negative',
    },
  },
  {
    category: 'Tax Benefits',
    renting: {
      title: 'No deductions available',
      description: 'Rent is not tax-deductible.',
      sentiment: 'negative',
    },
    buying: {
      title: 'Mortgage interest deduction',
      description: 'Mortgage interest and property taxes can lower your bill.',
      sentiment: 'positive',
    },
  },
  {
    category: 'Customization',
    renting: {
      title: 'Limited changes allowed',
      description: 'Most leases restrict renovations to cosmetic tweaks.',
      sentiment: 'negative',
    },
    buying: {
      title: 'Full creative control',
      description: 'Your home, your rules — renovate however you want.',
      sentiment: 'positive',
    },
  },
  {
    category: 'Market Risk',
    renting: {
      title: 'Shielded from price drops',
      description: 'A housing crash does not affect your net worth.',
      sentiment: 'positive',
    },
    buying: {
      title: 'Exposed to market swings',
      description: 'Home values can decline — selling at a loss is painful.',
      sentiment: 'negative',
    },
  },
]

const SENTIMENT_STYLES = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  neutral: 'text-amber-500 dark:text-amber-400',
  negative: 'text-rose-500 dark:text-rose-400',
} as const

function SentimentBar({ sentiment }: { sentiment: 'positive' | 'neutral' | 'negative' }) {
  return <div className={`w-0.5 h-full rounded-full ${
    sentiment === 'positive' ? 'bg-emerald-400 dark:bg-emerald-500' :
    sentiment === 'neutral' ? 'bg-amber-400 dark:bg-amber-500' :
    'bg-rose-400 dark:bg-rose-500'
  }`} />
}

const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY = 500

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
  }),
}

export default function ComparisonSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const pillsRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((newIndex: number) => {
    setActiveIndex(prev => {
      if (newIndex < 0 || newIndex >= COMPARISONS.length) return prev
      setDirection(newIndex > prev ? 1 : -1)
      return newIndex
    })
  }, [])

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        goTo(activeIndex + 1)
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        goTo(activeIndex - 1)
      }
    },
    [activeIndex, goTo],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => {
        const next = prev + 1
        if (next >= COMPARISONS.length) return prev
        setDirection(1)
        return next
      })
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => {
        const next = prev - 1
        if (next < 0) return prev
        setDirection(-1)
        return next
      })
    } else if (e.key === 'Home') {
      e.preventDefault()
      setDirection(-1)
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setDirection(1)
      setActiveIndex(COMPARISONS.length - 1)
    }
  }, [])

  // Auto-scroll and focus the active pill
  useEffect(() => {
    const container = pillsRef.current
    if (!container) return
    const activeButton = container.children[activeIndex] as HTMLElement
    activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    activeButton?.focus({ preventScroll: true })
  }, [activeIndex])

  const item = COMPARISONS[activeIndex]

  return (
    <section id="compare" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Renting vs. Buying
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              How the two paths compare across what matters most.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Category pill indicators */}
          <div
            ref={pillsRef}
            role="tablist"
            aria-label="Comparison categories"
            className="flex flex-wrap gap-1.5 mb-6 w-full justify-center"
            onKeyDown={handleKeyDown}
          >
            {COMPARISONS.map((c, i) => (
              <button
                key={c.category}
                role="tab"
                aria-selected={i === activeIndex}
                tabIndex={i === activeIndex ? 0 : -1}
                onClick={() => goTo(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap shrink-0
                  transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400
                  ${i === activeIndex
                    ? 'bg-slate-800 text-white shadow-md shadow-slate-800/15 dark:bg-white dark:text-slate-900 dark:shadow-none'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {c.category}
              </button>
            ))}
          </div>

          {/* Swipeable content area */}
          <div className="overflow-hidden touch-pan-y">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                role="tabpanel"
                aria-label={item.category}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Renting */}
                  <div className="glass-card rounded-2xl p-5 flex gap-3">
                    <SentimentBar sentiment={item.renting.sentiment} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Renting</span>
                      <h3 className={`font-semibold text-sm mt-0.5 ${SENTIMENT_STYLES[item.renting.sentiment]}`}>
                        {item.renting.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1">{item.renting.description}</p>
                    </div>
                  </div>

                  {/* Buying */}
                  <div className="glass-card rounded-2xl p-5 flex gap-3">
                    <SentimentBar sentiment={item.buying.sentiment} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Buying</span>
                      <h3 className={`font-semibold text-sm mt-0.5 ${SENTIMENT_STYLES[item.buying.sentiment]}`}>
                        {item.buying.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1">{item.buying.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
