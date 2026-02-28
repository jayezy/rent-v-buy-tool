import { useState } from 'react'
import type { CustomInputConfig } from '../../lib/types'

interface CustomValueInputProps {
  config: CustomInputConfig
  onSubmit: (value: number) => void
}

/** Parse displayed string to a number, stripping currency symbols and commas */
function parseValue(raw: string): number {
  return parseFloat(raw.replace(/[$,%\s]/g, '')) || 0
}

export default function CustomValueInput({ config, onSubmit }: CustomValueInputProps) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)

  const prefix = config.type === 'dollar' ? '$' : null
  const suffix = config.type === 'percent' ? '%' : config.type === 'years' ? ' yrs' : null

  function handleSubmit() {
    const num = parseValue(raw)
    if (isNaN(num) || raw.trim() === '') {
      setError('Please enter a valid number')
      return
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
    onSubmit(num)
    setRaw('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <p className="text-sm font-medium text-slate-500 mb-3">{config.label}</p>
      <div className="flex gap-3 items-start">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            inputMode="decimal"
            aria-label={config.label}
            value={raw}
            onChange={e => {
              setRaw(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKey}
            min={config.min}
            max={config.max}
            step={config.step ?? (config.type === 'percent' ? 0.1 : 1)}
            placeholder={
              config.type === 'dollar'
                ? '0'
                : config.type === 'percent'
                  ? '0.0'
                  : '0'
            }
            className={`w-full rounded-xl border py-3 text-slate-800 font-medium
              focus:outline-none focus:ring-2 transition-all
              ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}
              ${error
                ? 'border-red-300 focus:ring-red-300 bg-red-50'
                : 'border-slate-300 focus:ring-indigo-300 bg-white'
              }`}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={raw.trim() === ''}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200
            disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors cursor-pointer
            disabled:cursor-not-allowed shrink-0"
        >
          Use this
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
