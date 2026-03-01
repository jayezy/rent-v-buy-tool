import { motion } from 'motion/react'
import { useWizard } from '../../context/WizardContext'
import ScrollReveal from '../ui/ScrollReveal'
import type { SavedResult } from '../../lib/types'

const STEPS = [
  {
    title: 'Input Your Scenario',
    desc: 'Provide details about your income, housing budget, location, and risk tolerance.',
  },
  {
    title: 'Financial Modeling',
    desc: 'Mortgage amortization, tax implications, investment returns, and opportunity costs are calculated.',
  },
  {
    title: 'Review Projections',
    desc: 'Compare net wealth trajectories for both paths over your chosen time horizon.',
  },
]

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
            <span className="font-bold text-slate-800 text-lg tracking-tight">HomeWise</span>
          </button>
          <motion.button
            onClick={openSurvey}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm
              font-semibold rounded-full hover:bg-slate-800
              transition-colors cursor-pointer shadow-lg shadow-slate-900/20"
          >
            Get Started
          </motion.button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">
        {/* Animated blobs — neutral tones */}
        <div className="blob blob-1 w-[500px] h-[500px] bg-slate-300 top-[15%] -left-[5%]" />
        <div className="blob blob-2 w-[400px] h-[400px] bg-slate-400/60 top-[25%] right-[-3%]" />
        <div className="blob blob-3 w-[350px] h-[350px] bg-slate-200 bottom-[15%] left-[30%]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-slate-600 mb-10"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Rates Updated February 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-8"
          >
            Rent vs. Buy,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 via-slate-800 to-slate-600">
              Modeled for You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            A financial model that compares long-term wealth outcomes
            for buying a home versus renting and investing the difference.
          </motion.p>

          <motion.button
            onClick={openSurvey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900
              text-white font-semibold text-lg rounded-full shadow-xl shadow-slate-900/25
              hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Start Analysis
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-slate-400 mt-6"
          >
            10 questions · Personalized projections
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Previous Analyses ── */}
      {savedResults.length > 0 && (
        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Previous Analyses
                </h2>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_ALL_SAVED' })}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-slate-500 text-center mb-14 max-w-xl mx-auto">
              From inputs to projections in three steps
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200
                      flex items-center justify-center text-xl font-bold text-slate-700 mx-auto mb-5"
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Default Assumptions ── */}
      <section className="py-16 sm:py-20 px-6 relative overflow-hidden">
        <div className="blob w-[400px] h-[400px] bg-slate-300/40 -top-20 right-[-5%] opacity-20" style={{ animation: 'blob-drift 25s ease-in-out infinite' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Default Assumptions
            </h2>
            <p className="text-lg text-slate-500 text-center mb-12">
              Based on current national averages — adjustable after results
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={0}>
              <StatCard value="6.0%" label="Current Mortgage Rate" sub="30-yr fixed (Freddie Mac)" accent="slate" />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <StatCard value="4.0%" label="High-Yield Savings" sub="Best 1-yr CD rate" accent="emerald" />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <StatCard value="2.0%" label="Home Appreciation" sub="Zillow 2026 forecast" accent="blue" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Methodology
            </h2>
            <p className="text-lg text-slate-500 text-center mb-12 max-w-xl mx-auto">
              What the model accounts for
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                  </svg>
                }
                title="Amortization & Tax Math"
                desc="Full mortgage amortization schedule, property tax deductions, and standard deduction comparisons."
                color="slate"
              />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                }
                title="Wealth Trajectory Modeling"
                desc="Year-by-year net wealth comparison accounting for equity growth, opportunity cost, and investment returns."
                color="emerald"
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                }
                title="Sensitivity Analysis"
                desc="Adjust mortgage rates, home appreciation, rent growth, and other variables to see how outcomes change."
                color="blue"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-20 px-6">
        <ScrollReveal>
          <div
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800
              rounded-[2rem] py-16 px-8 shadow-2xl shadow-slate-900/30"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Run the Numbers for Your Situation
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Input your financial details and see a side-by-side projection of both paths.
            </p>
            <motion.button
              onClick={openSurvey}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-white text-slate-900 font-semibold text-lg rounded-full
                hover:shadow-lg transition-all cursor-pointer"
            >
              Start Analysis
            </motion.button>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-200/50">
        For informational purposes only. Not financial advice. Rates as of February 2026.
      </footer>
    </div>
  )
}

/* ── Sub-components ── */

function StatCard({
  value,
  label,
  sub,
  accent,
}: {
  value: string
  label: string
  sub: string
  accent: 'slate' | 'emerald' | 'blue'
}) {
  const colors = {
    slate: 'text-slate-800',
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
  }

  return (
    <div className="glass-card rounded-3xl p-8 text-center">
      <div className={`text-4xl font-extrabold ${colors[accent]} mb-2`}>{value}</div>
      <div className="font-semibold text-slate-700 text-sm mb-1">{label}</div>
      <div className="text-slate-400 text-xs">{sub}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  color: 'slate' | 'emerald' | 'blue'
}) {
  const bgMap = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
  }

  return (
    <div className="glass-card rounded-3xl p-8 text-center h-full">
      <div className={`w-14 h-14 rounded-2xl ${bgMap[color]} flex items-center justify-center mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-3">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}

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
            ${isBuy ? 'bg-blue-50' : 'bg-emerald-50'}`}
          >
            {isBuy ? '\u{1F3E0}' : '\u{1F4C8}'}
          </div>
          <div>
            <div className={`text-xs font-bold uppercase tracking-wider
              ${isBuy ? 'text-blue-600' : 'text-emerald-600'}`}
            >
              {isBuy ? 'Buy' : 'Rent'}
            </div>
            <div className="text-xs text-slate-400">{formatRelativeDate(saved.savedAt)}</div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="text-slate-300 hover:text-slate-500 transition-colors cursor-pointer p-1"
          aria-label={`Delete ${saved.label}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <p className="text-sm font-semibold text-slate-700 mb-1">{saved.label}</p>
      <p className="text-xs text-slate-400 mb-4">
        Wealth difference: {formatCurrency(Math.abs(saved.result.wealthDifference))} over {saved.result.projections.length}yr
      </p>

      {/* View button */}
      <motion.button
        onClick={onView}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-auto w-full py-2 text-sm font-medium text-slate-700 bg-slate-100
          hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
      >
        View Results
      </motion.button>
    </div>
  )
}
