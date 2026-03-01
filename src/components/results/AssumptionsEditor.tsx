import { useWizard } from '../../context/WizardContext'
import { DEFAULTS } from '../../lib/constants'
import type { AssumptionOverrides } from '../../lib/types'

interface SliderDef {
  key: keyof AssumptionOverrides
  label: string
  min: number
  max: number
  step: number
  format: (v: number) => string
}

const SLIDERS: SliderDef[] = [
  {
    key: 'mortgageRate',
    label: 'Mortgage rate',
    min: 0.02,
    max: 0.12,
    step: 0.0025,
    format: v => `${(v * 100).toFixed(2)}%`,
  },
  {
    key: 'homeAppreciation',
    label: 'Home appreciation / yr',
    min: -0.05,
    max: 0.15,
    step: 0.005,
    format: v => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: 'rentAppreciation',
    label: 'Rent increase / yr',
    min: 0,
    max: 0.1,
    step: 0.005,
    format: v => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: 'maintenance',
    label: 'Maintenance (% of value)',
    min: 0,
    max: 0.05,
    step: 0.0025,
    format: v => `${(v * 100).toFixed(2)}%`,
  },
  {
    key: 'closingCostsBuy',
    label: 'Buying closing costs',
    min: 0.01,
    max: 0.08,
    step: 0.005,
    format: v => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: 'sellingCosts',
    label: 'Selling costs',
    min: 0.01,
    max: 0.1,
    step: 0.005,
    format: v => `${(v * 100).toFixed(1)}%`,
  },
]

export default function AssumptionsEditor() {
  const { state, dispatch } = useWizard()
  const overrides = state.assumptionOverrides

  function getCurrentValue(key: keyof AssumptionOverrides): number {
    return overrides[key] ?? DEFAULTS[key as keyof typeof DEFAULTS] as number
  }

  function handleChange(key: keyof AssumptionOverrides, value: number) {
    dispatch({ type: 'UPDATE_ASSUMPTIONS', overrides: { [key]: value } })
  }

  function handleReset() {
    dispatch({ type: 'CLEAR_ASSUMPTIONS' })
  }

  const hasOverrides = Object.keys(overrides).length > 0

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
          Assumptions &amp; Rates
          {hasOverrides && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Customized
            </span>
          )}
        </div>
        {hasOverrides && (
          <button
            onClick={e => {
              e.preventDefault()
              handleReset()
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Reset to defaults
          </button>
        )}
      </summary>

      <div className="mt-6 space-y-5">
        {SLIDERS.map(slider => {
          const value = getCurrentValue(slider.key)
          const percent =
            ((value - slider.min) / (slider.max - slider.min)) * 100
          return (
            <div key={slider.key}>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`slider-${slider.key}`}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                  {slider.label}
                </label>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {slider.format(value)}
                </span>
              </div>
              <div className="relative">
                <input
                  id={`slider-${slider.key}`}
                  type="range"
                  aria-label={slider.label}
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={e => handleChange(slider.key, parseFloat(e.target.value))}
                  className="w-full h-2 appearance-none rounded-full cursor-pointer
                    bg-slate-200 dark:bg-slate-700 accent-slate-700 dark:accent-slate-400"
                  style={{
                    background: `linear-gradient(to right, var(--color-slider-fill) ${percent}%, var(--color-slider-track) ${percent}%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{slider.format(slider.min)}</span>
                <span>{slider.format(slider.max)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
        Rates are based on national averages as of February 2026. Drag sliders to model different scenarios — projections update instantly.
      </p>
    </details>
  )
}
