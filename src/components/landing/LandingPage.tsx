import { useWizard } from '../../context/WizardContext'
import ScrollReveal from '../ui/ScrollReveal'

const STEPS = [
  {
    title: 'Answer 10 Questions',
    desc: 'Tell us about your income, budget, location, and investment style.',
  },
  {
    title: 'We Crunch the Numbers',
    desc: 'Our model calculates mortgage costs, tax benefits, investment returns, and more.',
  },
  {
    title: 'Get Your Projection',
    desc: 'See a side-by-side wealth comparison to make a confident decision.',
  },
]

export default function LandingPage() {
  const { dispatch } = useWizard()
  const openSurvey = () => dispatch({ type: 'GO_TO_WIZARD' })

  return (
    <div className="min-h-screen">
      {/* ── Sticky Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-40 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">HomeWise</span>
          </div>
          <button
            onClick={openSurvey}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm
              font-semibold rounded-full hover:shadow-lg hover:shadow-violet-200/60
              transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Take the Survey
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">
        {/* Animated blobs */}
        <div className="blob blob-1 w-[500px] h-[500px] bg-violet-300 top-[15%] -left-[5%]" />
        <div className="blob blob-2 w-[400px] h-[400px] bg-rose-300 top-[25%] right-[-3%]" />
        <div className="blob blob-3 w-[350px] h-[350px] bg-sky-300 bottom-[15%] left-[30%]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-slate-600 mb-10">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            Free · No signup required · Updated Feb 2026
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-8">
            Should you{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500">
              buy or rent
            </span>
            ?
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Answer 10 quick questions and get a personalized, data-driven
            wealth projection — not just monthly payments.
          </p>

          <button
            onClick={openSurvey}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500
              text-white font-semibold text-lg rounded-full shadow-xl shadow-violet-200/50
              hover:shadow-2xl hover:shadow-violet-300/50 transition-all hover:-translate-y-1
              active:translate-y-0 cursor-pointer"
          >
            Take the Free Survey
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="text-sm text-slate-400 mt-6">Takes about 2 minutes · No account needed</p>
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

      {/* ── How It Works ── */}
      <section className="py-28 sm:py-36 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-slate-500 text-center mb-20 max-w-xl mx-auto">
              Three steps to financial clarity
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100
                      flex items-center justify-center text-2xl font-bold text-violet-600 mx-auto mb-6"
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Rates ── */}
      <section className="py-28 sm:py-36 px-6 relative overflow-hidden">
        <div className="blob w-[400px] h-[400px] bg-rose-200 -top-20 right-[-5%] opacity-20" style={{ animation: 'blob-drift 25s ease-in-out infinite' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Current market rates
            </h2>
            <p className="text-lg text-slate-500 text-center mb-16">
              The numbers driving your decision
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={0}>
              <StatCard value="6.0%" label="Current Mortgage Rate" sub="30-yr fixed (Freddie Mac)" accent="rose" />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <StatCard value="4.0%" label="High-Yield Savings" sub="Best 1-yr CD rate" accent="violet" />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <StatCard value="2.0%" label="Home Appreciation" sub="Zillow 2026 forecast" accent="teal" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28 sm:py-36 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Built on real math
            </h2>
            <p className="text-lg text-slate-500 text-center mb-16 max-w-xl mx-auto">
              Not guesswork — real financial modeling
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
                title="Real Financial Math"
                desc="Mortgage amortization, tax deductions, investment compounding — all calculated correctly."
                color="rose"
              />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                }
                title="10-Year Projections"
                desc="See exactly when buying catches up — or if renting + investing wins over your timeline."
                color="violet"
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <FeatureCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                }
                title="Editable Assumptions"
                desc="Tweak mortgage rates, appreciation, and more to model your personal scenario."
                color="teal"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 sm:py-36 px-6">
        <ScrollReveal>
          <div
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500
              rounded-[2rem] py-20 px-8 shadow-2xl shadow-violet-200/40"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to find out?
            </h2>
            <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Get your personalized rent vs. buy projection in under two minutes.
            </p>
            <button
              onClick={openSurvey}
              className="px-10 py-4 bg-white text-violet-600 font-semibold text-lg rounded-full
                hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Take the Free Survey
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-10 text-xs text-slate-400 border-t border-white/30">
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
  accent: 'rose' | 'violet' | 'teal'
}) {
  const colors = {
    rose: 'text-rose-500',
    violet: 'text-violet-500',
    teal: 'text-teal-500',
  }

  return (
    <div className="glass rounded-3xl p-8 text-center">
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
  color: 'rose' | 'violet' | 'teal'
}) {
  const bgMap = {
    rose: 'bg-rose-50 text-rose-500',
    violet: 'bg-violet-50 text-violet-500',
    teal: 'bg-teal-50 text-teal-500',
  }

  return (
    <div className="glass rounded-3xl p-8 text-center h-full">
      <div className={`w-14 h-14 rounded-2xl ${bgMap[color]} flex items-center justify-center mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-3">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}
