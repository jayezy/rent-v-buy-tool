interface BreakevenIndicatorProps {
  breakevenYear: number | null
  totalYears: number
}

export default function BreakevenIndicator({ breakevenYear, totalYears }: BreakevenIndicatorProps) {
  if (breakevenYear === null) {
    return (
      <div className="glass-card rounded-3xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-xl shrink-0">
          ⏳
        </div>
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200">No breakeven within {totalYears} years</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Buying doesn't catch up to renting + investing in your timeframe.
          </div>
        </div>
      </div>
    )
  }

  const pct = (breakevenYear / totalYears) * 100

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-xl shrink-0">
          ✓
        </div>
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Buying breaks even in year {breakevenYear}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            After this point, owning builds more wealth than renting + investing.
          </div>
        </div>
      </div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-slate-400 to-emerald-500 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span>Year 1</span>
        <span>Year {totalYears}</span>
      </div>
    </div>
  )
}
