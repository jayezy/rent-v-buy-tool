import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid,
} from 'recharts'
import type { YearProjection } from '../../lib/types'

interface CostComparisonChartProps {
  projections: YearProjection[]
  breakevenYear: number | null
}

function formatK(v: number): string {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
  return `$${(v / 1000).toFixed(0)}K`
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
      <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Year {label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CostComparisonChart({ projections, breakevenYear }: CostComparisonChartProps) {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Cumulative Cost</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Total money spent on housing over time</p>
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-rent)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-chart-rent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-buy)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-chart-buy)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Yr ${y}`}
            tick={{ fontSize: 12, fill: 'var(--color-chart-tick)' }}
            axisLine={{ stroke: 'var(--color-chart-grid)' }}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 12, fill: 'var(--color-chart-tick)' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativeRentCost"
            name="Renting"
            stroke="var(--color-chart-rent)"
            strokeWidth={2.5}
            fill="url(#rentGrad)"
          />
          <Area
            type="monotone"
            dataKey="cumulativeBuyCost"
            name="Buying"
            stroke="var(--color-chart-buy)"
            strokeWidth={2.5}
            fill="url(#buyGrad)"
          />
          {breakevenYear && (
            <ReferenceLine
              x={breakevenYear}
              stroke="var(--color-chart-renter)"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Breakeven Yr ${breakevenYear}`,
                position: 'top',
                fill: 'var(--color-chart-renter)',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
