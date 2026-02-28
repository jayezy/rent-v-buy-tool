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
    <div className="animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {question.title}
      </h2>
      <p className="text-slate-500 mb-8 text-base sm:text-lg">
        {question.subtitle}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option) => (
          <OptionCard
            key={String(option.value)}
            option={option}
            isSelected={selectedValue === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>

      {question.customInput && (
        <CustomValueInput
          config={question.customInput}
          onSubmit={(value) => onSelect(value)}
        />
      )}
    </div>
  )
}
