import { QUESTIONS } from '../../lib/constants'

interface ProgressBarProps {
  currentStep: number
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const total = QUESTIONS.length
  const pct = ((currentStep + 1) / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-500 font-medium">
          Question {currentStep + 1} of {total}
        </span>
        <span className="text-sm text-slate-400">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
