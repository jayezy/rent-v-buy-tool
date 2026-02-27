import type { QuestionOption } from '../../lib/types'

interface OptionCardProps {
  option: QuestionOption
  isSelected: boolean
  onClick: () => void
}

export default function OptionCard({ option, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
        cursor-pointer group
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-blue-300'}
        `}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <div className="font-semibold text-slate-800">{option.label}</div>
          {option.description && (
            <div className="text-sm text-slate-500 mt-0.5">{option.description}</div>
          )}
        </div>
      </div>
    </button>
  )
}
