import { motion } from 'motion/react'
import type { QuestionOption } from '../../lib/types'

interface OptionCardProps {
  option: QuestionOption
  isSelected: boolean
  onClick: () => void
}

export default function OptionCard({ option, isSelected, onClick }: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left p-5 rounded-2xl border-2 transition-colors duration-200
        cursor-pointer group
        ${isSelected
          ? 'border-slate-800 bg-slate-50 shadow-md shadow-slate-200'
          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md hover:shadow-slate-100'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${isSelected ? 'border-slate-800 bg-slate-800' : 'border-slate-300 group-hover:border-slate-400'}
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
    </motion.button>
  )
}
