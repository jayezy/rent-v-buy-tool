import type { ProjectionResult } from '../../lib/types'

interface SummaryCardProps {
  result: ProjectionResult
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function SummaryCard({ result }: SummaryCardProps) {
  const isBuy = result.recommendation === 'buy'

  return (
    <div className={`
      rounded-3xl p-6 sm:p-8 border-2
      ${isBuy
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
      }
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl
          ${isBuy ? 'bg-blue-100' : 'bg-emerald-100'}
        `}>
          {isBuy ? '🏠' : '📈'}
        </div>
        <div>
          <div className={`
            text-sm font-bold uppercase tracking-wider mb-1
            ${isBuy ? 'text-blue-600' : 'text-emerald-600'}
          `}>
            {isBuy ? 'Buying wins' : 'Renting + Investing wins'}
          </div>
          <p className="text-slate-700 text-lg sm:text-xl leading-relaxed">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200/60">
        <Stat
          label="Monthly mortgage"
          value={formatCurrency(result.monthlyMortgagePayment)}
        />
        <Stat
          label="Total interest paid"
          value={formatCurrency(result.totalInterestPaid)}
        />
        <Stat
          label="Buyer net wealth"
          value={formatCurrency(result.finalBuyerWealth)}
          accent={isBuy}
        />
        <Stat
          label="Renter net wealth"
          value={formatCurrency(result.finalRenterWealth)}
          accent={!isBuy}
        />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${accent ? 'text-blue-700' : 'text-slate-800'}`}>
        {value}
      </div>
    </div>
  )
}
