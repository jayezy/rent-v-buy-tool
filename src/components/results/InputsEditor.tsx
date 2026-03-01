import { useState } from 'react'
import { useWizard } from '../../context/WizardContext'
import { QUESTIONS } from '../../lib/constants'
import { zipToState } from '../../lib/zipToState'
import { STATE_DATA } from '../../lib/stateData'
import type { WizardAnswers, Question } from '../../lib/types'

/** Short labels for each question, keyed by question ID */
const SHORT_LABELS: Record<string, string> = {
  annualIncome: 'Annual Income',
  monthlyBudget: 'Monthly Budget',
  downPayment: 'Down Payment',
  homePrice: 'Home Price',
  investmentStyle: 'Investment Style',
  yearsToStay: 'Years to Stay',
  bigExpenses: 'Big Expenses',
  location: 'Location',
  totalSavings: 'Total Savings',
  household: 'Household',
}

/** Format a dollar value as a compact string */
function formatDollar(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${Math.round(v).toLocaleString()}`
  return `$${v}`
}

/** Format an answer value for display */
function formatAnswerDisplay(question: Question, value: number | string): string {
  const { id, options, customInput } = question

  // For option-based questions, try to find the matching option label
  if (options.length > 0) {
    const match = options.find(o => o.value === value)
    if (match) return match.label
  }

  // For zip codes
  if (id === 'location' && typeof value === 'string') {
    const stateAbbr = zipToState(value)
    if (stateAbbr && STATE_DATA[stateAbbr]) {
      return `${value} (${STATE_DATA[stateAbbr].stateName})`
    }
    return value
  }

  // For string values (household type when no option matched)
  if (typeof value === 'string') return value

  // For numeric custom input values
  if (customInput) {
    if (customInput.type === 'dollar') return formatDollar(value)
    if (customInput.type === 'percent') return `${(value * 100).toFixed(0)}%`
    if (customInput.type === 'years') return `${value} years`
  }

  // Fallback for investmentStyle as decimal
  if (id === 'investmentStyle' && typeof value === 'number' && value < 1) {
    return `${(value * 100).toFixed(0)}% return`
  }

  return String(value)
}

interface InputRowProps {
  question: Question
  currentValue: number | string
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onUpdate: (value: number | string) => void
}

function InputRow({ question, currentValue, isEditing, onStartEdit, onCancelEdit, onUpdate }: InputRowProps) {
  const [zipRaw, setZipRaw] = useState('')
  const [zipError, setZipError] = useState<string | null>(null)
  const isZip = question.customInput?.type === 'zip'

  function handleOptionSelect(value: number | string) {
    onUpdate(value)
  }

  function handleZipSubmit() {
    const cleaned = zipRaw.replace(/\D/g, '')
    if (cleaned.length !== 5) {
      setZipError('Enter a 5-digit zip code')
      return
    }
    const stateAbbr = zipToState(cleaned)
    if (!stateAbbr) {
      setZipError('Not a recognized US zip code')
      return
    }
    setZipError(null)
    onUpdate(cleaned)
    setZipRaw('')
  }

  function handleZipKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleZipSubmit()
    if (e.key === 'Escape') onCancelEdit()
  }

  if (!isEditing) {
    return (
      <button
        onClick={onStartEdit}
        className="w-full flex items-center justify-between py-3 px-1 rounded-xl
          hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group/row text-left"
      >
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{SHORT_LABELS[question.id] || question.id}</span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          {formatAnswerDisplay(question, currentValue)}
          <svg
            className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover/row:text-slate-500 dark:group-hover/row:text-slate-400 transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </span>
      </button>
    )
  }

  // Edit mode — zip code
  if (isZip) {
    const stateHint = zipRaw.length === 5 ? (() => {
      const abbr = zipToState(zipRaw)
      return abbr && STATE_DATA[abbr] ? STATE_DATA[abbr].stateName : null
    })() : null

    return (
      <div className="py-3 px-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{SHORT_LABELS[question.id]}</span>
          <button onClick={onCancelEdit} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Cancel</button>
        </div>
        <div className="flex gap-2 items-start">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              aria-label="Edit zip code"
              value={zipRaw}
              onChange={e => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 5)
                setZipRaw(cleaned)
                setZipError(null)
              }}
              onKeyDown={handleZipKey}
              placeholder={typeof currentValue === 'string' ? currentValue : 'e.g. 90210'}
              autoFocus
              className={`w-full rounded-lg border py-2 px-3 text-sm text-slate-800 dark:text-slate-200 font-medium
                focus:outline-none focus:ring-2 transition-all tracking-widest
                ${zipError
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700 bg-red-50 dark:bg-red-950'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-slate-400 dark:focus:ring-slate-500 bg-white dark:bg-slate-800'
                }`}
            />
          </div>
          <button
            onClick={handleZipSubmit}
            disabled={zipRaw.length < 5}
            className="px-3 py-2 text-sm bg-slate-800 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-700
              disabled:text-slate-400 dark:disabled:text-slate-500 text-white dark:text-slate-900 font-semibold rounded-lg transition-colors cursor-pointer
              disabled:cursor-not-allowed shrink-0"
          >
            Update
          </button>
        </div>
        {stateHint && !zipError && (
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{stateHint}</p>
        )}
        {zipError && (
          <p role="alert" className="mt-1 text-xs text-red-500 dark:text-red-400">{zipError}</p>
        )}
      </div>
    )
  }

  // Edit mode — option pills + optional custom input
  return (
    <div className="py-3 px-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{SHORT_LABELS[question.id]}</span>
        <button onClick={onCancelEdit} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Cancel</button>
      </div>
      {question.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {question.options.map(opt => {
            const isSelected = opt.value === currentValue
            return (
              <button
                key={String(opt.value)}
                onClick={() => handleOptionSelect(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer
                  ${isSelected
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
      {question.customInput && question.customInput.type !== 'zip' && (
        <CustomInlineInput
          config={question.customInput}
          onSubmit={(v) => handleOptionSelect(v)}
        />
      )}
    </div>
  )
}

interface CustomInlineInputProps {
  config: NonNullable<Question['customInput']>
  onSubmit: (v: number) => void
}

function CustomInlineInput({ config, onSubmit }: CustomInlineInputProps) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)

  const prefix = config.type === 'dollar' ? '$' : null
  const suffix = config.type === 'percent' ? '%' : config.type === 'years' ? ' yrs' : null

  function handleSubmit() {
    const num = parseFloat(raw.replace(/[$,%\s]/g, '')) || 0
    if (isNaN(num) || raw.trim() === '') {
      setError('Enter a valid number')
      return
    }
    // For percent type, the value entered is already in percent form (e.g. "7" for 7%)
    // but the stored value is a decimal (0.07). Convert if needed.
    let finalValue = num
    if (config.type === 'percent') {
      finalValue = num / 100
    }
    if (num < config.min) {
      setError(`Minimum is ${config.min}`)
      return
    }
    if (num > config.max) {
      setError(`Maximum is ${config.max.toLocaleString()}`)
      return
    }
    setError(null)
    onSubmit(finalValue)
    setRaw('')
  }

  return (
    <div className="mt-2 flex gap-2 items-start">
      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          aria-label={config.label}
          value={raw}
          onChange={e => { setRaw(e.target.value); setError(null) }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          min={config.min}
          max={config.max}
          step={config.step ?? (config.type === 'percent' ? 0.1 : 1)}
          placeholder="Custom"
          className={`w-full rounded-lg border py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium
            focus:outline-none focus:ring-2 transition-all
            ${prefix ? 'pl-6 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'}
            ${error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700 bg-red-50 dark:bg-red-950'
              : 'border-slate-300 dark:border-slate-600 focus:ring-slate-400 dark:focus:ring-slate-500 bg-white dark:bg-slate-800'
            }`}
        />
        {suffix && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs pointer-events-none">{suffix}</span>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={raw.trim() === ''}
        className="px-3 py-1.5 text-xs bg-slate-800 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-700
          disabled:text-slate-400 dark:disabled:text-slate-500 text-white dark:text-slate-900 font-semibold rounded-lg transition-colors cursor-pointer
          disabled:cursor-not-allowed shrink-0"
      >
        Set
      </button>
      {error && <p role="alert" className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  )
}

export default function InputsEditor() {
  const { state, dispatch } = useWizard()
  const answers = state.answers as WizardAnswers
  const [editingId, setEditingId] = useState<string | null>(null)

  function handleUpdate(questionId: keyof WizardAnswers, value: number | string) {
    dispatch({ type: 'UPDATE_ANSWER', questionId, value })
    setEditingId(null)
  }

  return (
    <details className="glass-card rounded-3xl p-6 group">
      <summary className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer list-none flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform group-open:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Your Inputs
          <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium">
            {QUESTIONS.length} answers
          </span>
        </div>
      </summary>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {QUESTIONS.map(q => (
          <InputRow
            key={q.id}
            question={q}
            currentValue={answers[q.id]}
            isEditing={editingId === q.id}
            onStartEdit={() => setEditingId(q.id)}
            onCancelEdit={() => setEditingId(null)}
            onUpdate={(value) => handleUpdate(q.id, value)}
          />
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        Click any value to edit it — results will recalculate instantly.
      </p>
    </details>
  )
}
