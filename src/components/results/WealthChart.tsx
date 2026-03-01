import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts'
import type { YearProjection } from '../../lib/types'

interface WealthChartProps {
  projections: YearProjection[]
}

function formatK(v: number): string {
  if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
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
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 text-sm">
      <div className="font-semibold text-slate-700 mb-2">Year {label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-medium text-slate-800">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function WealthChart({ projections }: WealthChartProps) {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Net Wealth Comparison</h3>
      <p className="text-sm text-slate-500 mb-4">
        Home equity (minus selling costs) vs. investment portfolio
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Yr ${y}`}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="buyerNetWealth"
            name="Buyer (equity)"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="renterNetWealth"
            name="Renter (investments)"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
