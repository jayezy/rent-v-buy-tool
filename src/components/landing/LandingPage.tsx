import { motion } from 'motion/react'
import { useWizard } from '../../context/WizardContext'
import ScrollReveal from '../ui/ScrollReveal'
import ThemeToggle from '../ui/ThemeToggle'
import ComparisonSection from './ComparisonSection'
import type { SavedResult } from '../../lib/types'

export default function LandingPage() {
  const { state, dispatch } = useWizard()
  const openSurvey = () => dispatch({ type: 'GO_TO_WIZARD' })
  const { savedResults } = state

  return (
    <div className="min-h-screen">
      {/* ── Sticky Nav ── */}
      <header className="fixed left-0 right-0 z-40 glass top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'GO_TO_LANDING' })}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-lg tracking-tight">HomeWise</span>
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              onClick={openSurvey}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm
                font-semibold rounded-full hover:bg-slate-800
                dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100
                transition-colors cursor-pointer shadow-lg shadow-slate-900/20 dark:shadow-black/30"
            >
              Try Calculator
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Compact Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 mb-8"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Rates Updated February 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6"
          >
            Should You{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 via-slate-800 to-slate-600 dark:from-slate-300 dark:via-white dark:to-slate-300">
              Rent or Buy?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed font-light"
          >
            Model your scenario and compare long-term wealth outcomes for both paths.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={openSurvey}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900
                text-white font-semibold text-base rounded-full shadow-xl shadow-slate-900/25
                hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100
                dark:shadow-black/30 transition-colors cursor-pointer"
            >
              Run Your Numbers
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
              10 questions · Personalized projections
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Renter vs Buyer Comparison ── */}
      <ComparisonSection />

      {/* ── Previous Analyses ── */}
      {savedResults.length > 0 && (
        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Previous Analyses
                </h2>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_ALL_SAVED' })}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedResults.map((saved, i) => (
                <ScrollReveal key={saved.id} delay={i * 100}>
                  <SavedResultCard
                    saved={saved}
                    onView={() => dispatch({ type: 'LOAD_SAVED_RESULT', id: saved.id })}
                    onDelete={() => dispatch({ type: 'DELETE_SAVED_RESULT', id: saved.id })}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-700/50">
        For informational purposes only. Not financial advice. Rates as of February 2026.
      </footer>
    </div>
  )
}

/* ── Sub-components ── */

function formatRelativeDate(timestamp: number): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function SavedResultCard({
  saved,
  onView,
  onDelete,
}: {
  saved: SavedResult
  onView: () => void
  onDelete: () => void
}) {
  const isBuy = saved.result.recommendation === 'buy'

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full">
      {/* Header: icon + recommendation */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
            ${isBuy ? 'bg-blue-50 dark:bg-blue-950' : 'bg-emerald-50 dark:bg-emerald-950'}`}
          >
            {isBuy ? '\u{1F3E0}' : '\u{1F4C8}'}
          </div>
          <div>
            <div className={`text-xs font-bold uppercase tracking-wider
              ${isBuy ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              {isBuy ? 'Buy' : 'Rent'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{formatRelativeDate(saved.savedAt)}</div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer p-1"
          aria-label={`Delete ${saved.label}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{saved.label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Wealth difference: {formatCurrency(Math.abs(saved.result.wealthDifference))} over {saved.result.projections.length}yr
      </p>

      {/* View button */}
      <motion.button
        onClick={onView}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-auto w-full py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800
          hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
      >
        View Results
      </motion.button>
    </div>
  )
}
