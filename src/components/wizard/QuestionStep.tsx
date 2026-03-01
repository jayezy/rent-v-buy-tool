import { motion } from 'motion/react'
import type { Question } from '../../lib/types'
import OptionCard from './OptionCard'
import CustomValueInput from './CustomValueInput'

interface QuestionStepProps {
  question: Question
  selectedValue: number | string | undefined
  onSelect: (value: number | string) => void
}

export default function QuestionStep({ question, selectedValue, onSelect }: QuestionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {question.title}
      </h2>
      <p className="text-slate-500 mb-8 text-base sm:text-lg">
        {question.subtitle}
      </p>
      {question.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <motion.div
              key={String(option.value)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <OptionCard
                option={option}
                isSelected={selectedValue === option.value}
                onClick={() => onSelect(option.value)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {question.customInput && (
        <CustomValueInput
          config={question.customInput}
          onSubmit={(value) => onSelect(value)}
        />
      )}
    </motion.div>
  )
}
