import type { ProjectionResult } from '../../lib/types'
import { useWizard } from '../../context/WizardContext'
import SummaryCard from './SummaryCard'
import CostComparisonChart from './CostComparisonChart'
import WealthChart from './WealthChart'
import BreakevenIndicator from './BreakevenIndicator'
import AssumptionsEditor from './AssumptionsEditor'

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

        {/* Assumptions — interactive editor */}
        <AssumptionsEditor />
      </div>
    </div>
  )
}
