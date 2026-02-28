import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SummaryCard from '../../components/results/SummaryCard'
import type { ProjectionResult } from '../../lib/types'

function makeResult(overrides: Partial<ProjectionResult> = {}): ProjectionResult {
  return {
    projections: [],
    recommendation: 'buy',
    breakevenYear: 7,
    totalBuyCost: 400000,
    totalRentCost: 360000,
    finalBuyerWealth: 250000,
    finalRenterWealth: 200000,
    wealthDifference: 50000,
    monthlyMortgagePayment: 2398,
    totalInterestPaid: 95000,
    summary: 'Buying wins over 10 years, building $50,000 more wealth.',
    ...overrides,
  }
}

describe('SummaryCard — buy recommendation', () => {
  it('shows "Buying wins" label', () => {
    render(<SummaryCard result={makeResult({ recommendation: 'buy' })} />)
    expect(screen.getByText('Buying wins')).toBeInTheDocument()
  })

  it('shows the summary text', () => {
    render(<SummaryCard result={makeResult()} />)
    expect(screen.getByText(/Buying wins over 10 years/)).toBeInTheDocument()
  })

  it('shows the monthly mortgage payment', () => {
    render(<SummaryCard result={makeResult({ monthlyMortgagePayment: 2398 })} />)
    expect(screen.getByText('$2,398')).toBeInTheDocument()
  })

  it('shows buyer net wealth', () => {
    render(<SummaryCard result={makeResult({ finalBuyerWealth: 250000 })} />)
    expect(screen.getByText('$250,000')).toBeInTheDocument()
  })

  it('shows renter net wealth', () => {
    render(<SummaryCard result={makeResult({ finalRenterWealth: 200000 })} />)
    expect(screen.getByText('$200,000')).toBeInTheDocument()
  })
})

describe('SummaryCard — rent recommendation', () => {
  it('shows "Renting + Investing wins" label', () => {
    render(<SummaryCard result={makeResult({ recommendation: 'rent', wealthDifference: -50000 })} />)
    expect(screen.getByText('Renting + Investing wins')).toBeInTheDocument()
  })
})
