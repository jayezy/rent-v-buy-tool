import type { ProjectionResult } from '../../lib/types'
import { useWizard } from '../../context/WizardContext'
import SummaryCard from './SummaryCard'
import CostComparisonChart from './CostComparisonChart'
import WealthChart from './WealthChart'
import BreakevenIndicator from './BreakevenIndicator'

interface ResultsDashboardProps {
  result: ProjectionResult
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { dispatch } = useWizard()
  const totalYears = result.projections.length

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Your Results</h1>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl
              hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Summary */}
        <SummaryCard result={result} />

        {/* Breakeven */}
        <BreakevenIndicator
          breakevenYear={result.breakevenYear}
          totalYears={totalYears}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CostComparisonChart
            projections={result.projections}
            breakevenYear={result.breakevenYear}
          />
          <WealthChart projections={result.projections} />
        </div>

        {/* Assumptions */}
        <details className="bg-white rounded-3xl border border-slate-200 p-6 group">
          <summary className="font-bold text-slate-700 cursor-pointer list-none flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Assumptions & Rates Used
          </summary>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
            <Assumption label="Mortgage rate" value="6.0%" />
            <Assumption label="Mortgage term" value="30 years" />
            <Assumption label="Home appreciation" value="2.0%/yr" />
            <Assumption label="Rent increase" value="3.0%/yr" />
            <Assumption label="Maintenance" value="1.0%/yr" />
            <Assumption label="Closing costs" value="3% of price" />
            <Assumption label="Selling costs" value="6% of value" />
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Rates are based on national averages as of February 2026. Your actual rates may vary.
          </p>
        </details>
      </div>
    </div>
  )
}

function Assumption({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
