import { useState } from 'react'
import type { CustomInputConfig } from '../../lib/types'
import { zipToState } from '../../lib/zipToState'
import { STATE_DATA } from '../../lib/stateData'

interface CustomValueInputProps {
  config: CustomInputConfig
  onSubmit: (value: number | string) => void
}

/** Parse displayed string to a number, stripping currency symbols and commas */
function parseValue(raw: string): number {
  return parseFloat(raw.replace(/[$,%\s]/g, '')) || 0
}

export default function CustomValueInput({ config, onSubmit }: CustomValueInputProps) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [stateHint, setStateHint] = useState<string | null>(null)

  const isZip = config.type === 'zip'
  const prefix = config.type === 'dollar' ? '$' : null
  const suffix = config.type === 'percent' ? '%' : config.type === 'years' ? ' yrs' : null

  function handleZipChange(value: string) {
    // Only allow digits, max 5 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 5)
    setRaw(cleaned)
    setError(null)

    // Show state hint when 5 digits entered
    if (cleaned.length === 5) {
      const stateAbbr = zipToState(cleaned)
      if (stateAbbr && STATE_DATA[stateAbbr]) {
        setStateHint(STATE_DATA[stateAbbr].stateName)
      } else {
        setStateHint(null)
      }
    } else {
      setStateHint(null)
    }
  }

  function handleSubmit() {
    if (isZip) {
      const cleaned = raw.replace(/\D/g, '')
      if (cleaned.length !== 5) {
        setError('Please enter a 5-digit zip code')
        return
      }
      const stateAbbr = zipToState(cleaned)
      if (!stateAbbr) {
        setError('Not a recognized US zip code')
        return
      }
      setError(null)
      onSubmit(cleaned)
      setRaw('')
      setStateHint(null)
      return
    }

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
    <div className={isZip ? '' : 'mt-6 pt-6 border-t border-slate-200 dark:border-slate-700'}>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{config.label}</p>
      <div className="flex gap-3 items-start">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium pointer-events-none">
              {prefix}
            </span>
          )}
          {isZip ? (
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              aria-label={config.label}
              value={raw}
              onChange={e => handleZipChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. 90210"
              className={`w-full rounded-xl border py-3 px-4 text-slate-800 dark:text-slate-200 font-medium
                focus:outline-none focus:ring-2 transition-all text-lg tracking-widest
                ${error
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700 bg-red-50 dark:bg-red-950'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-slate-400 dark:focus:ring-slate-500 bg-white dark:bg-slate-800'
                }`}
            />
          ) : (
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
              className={`w-full rounded-xl border py-3 text-slate-800 dark:text-slate-200 font-medium
                focus:outline-none focus:ring-2 transition-all
                ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}
                ${error
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700 bg-red-50 dark:bg-red-950'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-slate-400 dark:focus:ring-slate-500 bg-white dark:bg-slate-800'
                }`}
            />
          )}
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={raw.trim() === ''}
          className="px-5 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-700
            disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors cursor-pointer
            disabled:cursor-not-allowed shrink-0"
        >
          {isZip ? 'Continue' : 'Use this'}
        </button>
      </div>
      {stateHint && !error && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          {stateHint}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
