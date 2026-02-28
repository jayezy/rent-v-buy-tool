import { useWizard } from '../../context/WizardContext'

export default function LandingPage() {
  const { dispatch } = useWizard()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-lg">HomeWise</span>
        </div>
        <button
          onClick={() => dispatch({ type: 'GO_TO_WIZARD' })}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          Take the Survey →
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Free · No signup required · Updated Feb 2026
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Should you{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              buy or rent
            </span>
            ?
          </h1>

          <p className="text-xl text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Answer 10 quick questions and get a personalized, data-driven projection comparing your
            total wealth under both scenarios — not just monthly payments.
          </p>
          <p className="text-base text-slate-500 mb-12">
            We model home equity, investment returns on saved capital, mortgage interest deductions, and more.
          </p>

          <button
            onClick={() => dispatch({ type: 'GO_TO_WIZARD' })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
              text-lg rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all
              hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Take the Free Survey
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="text-sm text-slate-400 mt-4">Takes about 2 minutes · No account needed</p>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          <StatCard
            value="6.0%"
            label="Current Mortgage Rate"
            sub="30-yr fixed (Freddie Mac)"
            color="indigo"
          />
          <StatCard
            value="4.0%"
            label="High-Yield Savings"
            sub="Best 1-yr CD rate"
            color="blue"
          />
          <StatCard
            value="2.0%"
            label="Home Appreciation"
            sub="Zillow 2026 forecast"
            color="violet"
          />
        </div>
      </main>

      {/* Feature strip */}
      <section className="bg-white/60 backdrop-blur border-t border-slate-200 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Real Financial Math"
            desc="Mortgage amortization, tax deductions, investment compounding — all calculated correctly."
          />
          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            title="10-Year Projections"
            desc="See exactly when buying catches up — or if renting + investing wins over your timeline."
          />
          <Feature
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            }
            title="Editable Assumptions"
            desc="Tweak mortgage rates, appreciation, and more to model your personal scenario."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        For informational purposes only. Not financial advice. Rates as of February 2026.
      </footer>
    </div>
  )
}

function StatCard({
  value,
  label,
  sub,
  color,
}: {
  value: string
  label: string
  sub: string
  color: 'indigo' | 'blue' | 'violet'
}) {
  const ring = {
    indigo: 'ring-indigo-200',
    blue: 'ring-blue-200',
    violet: 'ring-violet-200',
  }[color]
  const text = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    violet: 'text-violet-600',
  }[color]

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ring-1 ${ring}`}>
      <div className={`text-3xl font-extrabold ${text} mb-1`}>{value}</div>
      <div className="font-semibold text-slate-700 text-sm mb-0.5">{label}</div>
      <div className="text-slate-400 text-xs">{sub}</div>
    </div>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}
