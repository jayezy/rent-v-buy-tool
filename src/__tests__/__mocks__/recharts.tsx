/**
 * Recharts mock for tests.
 * Replaces chart components with plain <div>s so jsdom doesn't warn
 * about unknown SVG elements or non-DOM props like dataKey, tickFormatter, etc.
 * Props that would cause React "unknown DOM attribute" warnings are stripped.
 */
import type { ReactNode } from 'react'

const STRIP_PROPS = new Set([
  'dataKey', 'tickFormatter', 'axisLine', 'tickLine', 'wrapperStyle',
  'activeDot', 'strokeDasharray', 'strokeWidth', 'strokeOpacity',
  'fillOpacity', 'isAnimationActive', 'connectNulls', 'dot',
  'type', 'stopColor', 'stopOpacity', 'x1', 'y1', 'x2', 'y2',
  'offset', 'gradientUnits',
])

const stub =
  (name: string) =>
  ({ children, ...rest }: { children?: ReactNode; [key: string]: unknown }) => {
    const safe: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(rest)) {
      if (!STRIP_PROPS.has(k)) safe[k] = v
    }
    return (
      <div data-testid={`recharts-${name}`} {...safe}>
        {children}
      </div>
    )
  }

export const ResponsiveContainer = stub('responsive-container')
export const AreaChart = stub('area-chart')
export const LineChart = stub('line-chart')
export const ComposedChart = stub('composed-chart')
export const BarChart = stub('bar-chart')
export const Area = stub('area')
export const Line = stub('line')
export const Bar = stub('bar')
export const XAxis = stub('x-axis')
export const YAxis = stub('y-axis')
export const CartesianGrid = stub('cartesian-grid')
export const Tooltip = stub('tooltip')
export const Legend = stub('legend')
export const ReferenceLine = stub('reference-line')
