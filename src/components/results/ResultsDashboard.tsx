import { motion } from 'motion/react'
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
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 glass">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'GO_TO_LANDING' })}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">HomeWise</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800">Your Results</h1>
            <motion.button
              onClick={() => dispatch({ type: 'RESET' })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl
                hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Start Over
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SummaryCard result={result} />
        </motion.div>

        {/* Breakeven */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BreakevenIndicator
            breakevenYear={result.breakevenYear}
            totalYears={totalYears}
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CostComparisonChart
            projections={result.projections}
            breakevenYear={result.breakevenYear}
          />
          <WealthChart projections={result.projections} />
        </motion.div>

        {/* Assumptions — interactive editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AssumptionsEditor />
        </motion.div>
      </div>
    </div>
  )
}
