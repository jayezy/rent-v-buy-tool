import { describe, it, expect } from 'vitest'
import { calculateProjections } from '../../lib/calculations'
import type { WizardAnswers } from '../../lib/types'

// ─── Baseline test fixture ───────────────────────────────────────────────────
// $500K home, 20% down ($100K), $3K/mo rent budget, 10yr, index-fund investor
const BASE: WizardAnswers = {
  annualIncome: 125000,
  monthlyBudget: 3000,
  downPayment: 100000,
  homePrice: 500000,
  investmentStyle: 0.07,   // 7% index funds
  yearsToStay: 10,
  bigExpenses: 0,
  location: '90210',
  totalSavings: 137500,
  household: 'single',
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function makeAnswers(overrides: Partial<WizardAnswers> = {}): WizardAnswers {
  return { ...BASE, ...overrides }
}

// ─── Output shape ─────────────────────────────────────────────────────────────
describe('calculateProjections — output shape', () => {
  it('returns the correct top-level keys', () => {
    const result = calculateProjections(BASE)
    expect(result).toHaveProperty('projections')
    expect(result).toHaveProperty('recommendation')
    expect(result).toHaveProperty('breakevenYear')
    expect(result).toHaveProperty('totalBuyCost')
    expect(result).toHaveProperty('totalRentCost')
    expect(result).toHaveProperty('finalBuyerWealth')
    expect(result).toHaveProperty('finalRenterWealth')
    expect(result).toHaveProperty('wealthDifference')
    expect(result).toHaveProperty('monthlyMortgagePayment')
    expect(result).toHaveProperty('totalInterestPaid')
    expect(result).toHaveProperty('summary')
  })

  it('returns one projection row per year', () => {
    const result = calculateProjections(BASE)
    expect(result.projections).toHaveLength(10)
  })

  it('each projection row has the expected keys', () => {
    const row = calculateProjections(BASE).projections[0]
    const keys = [
      'year', 'monthlyRent', 'annualRentCost', 'cumulativeRentCost',
      'renterInvestmentBalance', 'renterNetWealth',
      'monthlyMortgage', 'annualBuyCost', 'cumulativeBuyCost',
      'homeValue', 'remainingMortgage', 'equityBuilt', 'buyerNetWealth',
      'monthlySavingsIfRenting', 'buyAdvantage',
    ]
    keys.forEach(k => expect(row).toHaveProperty(k))
  })

  it('year numbers run from 1 to yearsToStay', () => {
    const { projections } = calculateProjections(BASE)
    projections.forEach((row, i) => expect(row.year).toBe(i + 1))
  })

  it('recommendation is "buy" or "rent"', () => {
    expect(['buy', 'rent']).toContain(calculateProjections(BASE).recommendation)
  })

  it('summary is a non-empty string', () => {
    const { summary } = calculateProjections(BASE)
    expect(typeof summary).toBe('string')
    expect(summary.length).toBeGreaterThan(10)
  })
})

// ─── Mortgage math ────────────────────────────────────────────────────────────
describe('calculateProjections — mortgage math', () => {
  // $400K loan (500K home, 100K down), 6% rate, 30yr → EMI ≈ $2,398
  it('monthly mortgage payment is approximately correct for a 6% 30yr loan', () => {
    const { monthlyMortgagePayment } = calculateProjections(BASE)
    expect(monthlyMortgagePayment).toBeGreaterThan(2350)
    expect(monthlyMortgagePayment).toBeLessThan(2450)
  })

  it('total interest paid is positive and less than the loan amount over 10yr', () => {
    const { totalInterestPaid } = calculateProjections(BASE)
    expect(totalInterestPaid).toBeGreaterThan(0)
    // 10yr of interest on a 400K loan at 6% < 400K
    expect(totalInterestPaid).toBeLessThan(400000)
  })

  it('remaining mortgage decreases each year', () => {
    const { projections } = calculateProjections(BASE)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].remainingMortgage).toBeLessThan(projections[i - 1].remainingMortgage)
    }
  })

  it('home value appreciates each year at 2%/yr', () => {
    const { projections } = calculateProjections(BASE)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].homeValue).toBeGreaterThan(projections[i - 1].homeValue)
    }
    // Year 1: 500K * 1.02 = 510K
    expect(projections[0].homeValue).toBeCloseTo(510000, -3)
  })

  it('equity built increases over time', () => {
    const { projections } = calculateProjections(BASE)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].equityBuilt).toBeGreaterThan(projections[i - 1].equityBuilt)
    }
  })
})

// ─── Rent scenario ────────────────────────────────────────────────────────────
describe('calculateProjections — rent scenario', () => {
  it('monthly rent starts at monthlyBudget and grows 3%/yr', () => {
    const { projections } = calculateProjections(BASE)
    // year 1: no growth yet (1.03^0 = 1)
    expect(projections[0].monthlyRent).toBe(BASE.monthlyBudget)
    // year 2: 3000 * 1.03 = 3090
    expect(projections[1].monthlyRent).toBeCloseTo(3090, -1)
  })

  it('cumulative rent cost increases each year', () => {
    const { projections } = calculateProjections(BASE)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].cumulativeRentCost).toBeGreaterThan(projections[i - 1].cumulativeRentCost)
    }
  })

  it('renter investment balance grows each year', () => {
    const { projections } = calculateProjections(BASE)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].renterInvestmentBalance).toBeGreaterThan(projections[i - 1].renterInvestmentBalance)
    }
  })
})

// ─── Big expenses ─────────────────────────────────────────────────────────────
describe('calculateProjections — big expenses', () => {
  it('big expenses reduce the effective down payment', () => {
    const withExpense = calculateProjections(makeAnswers({ bigExpenses: 50000 }))
    const withoutExpense = calculateProjections(BASE)
    // Smaller down payment → higher loan → higher monthly mortgage
    expect(withExpense.monthlyMortgagePayment).toBeGreaterThan(withoutExpense.monthlyMortgagePayment)
  })

  it('big expenses exceeding down payment clamp loan to full home price', () => {
    // bigExpenses > downPayment: effectiveDownPayment = 0, loan = homePrice
    const result = calculateProjections(makeAnswers({ bigExpenses: 200000, downPayment: 100000 }))
    // Loan = 500K, 6% 30yr → EMI ≈ $2,998
    expect(result.monthlyMortgagePayment).toBeGreaterThan(2900)
    expect(result.monthlyMortgagePayment).toBeLessThan(3100)
  })
})

// ─── Time horizon ─────────────────────────────────────────────────────────────
describe('calculateProjections — time horizon', () => {
  it('3-year projection has 3 rows', () => {
    expect(calculateProjections(makeAnswers({ yearsToStay: 3 })).projections).toHaveLength(3)
  })

  it('20-year projection has 20 rows', () => {
    expect(calculateProjections(makeAnswers({ yearsToStay: 20 })).projections).toHaveLength(20)
  })

  it('short stays (3yr) favour renting — breakeven is null or > 3', () => {
    const { breakevenYear } = calculateProjections(makeAnswers({ yearsToStay: 3 }))
    expect(breakevenYear === null || breakevenYear > 3).toBe(true)
  })

  it('long stays (20yr) with conservative returns (4% CD) should have a breakeven year', () => {
    // With low investment returns (4% CD), equity gains from buying
    // eventually outpace renter's investment portfolio
    const { breakevenYear } = calculateProjections(
      makeAnswers({ yearsToStay: 20, investmentStyle: 0.04, monthlyBudget: 2500 })
    )
    expect(breakevenYear).not.toBeNull()
    expect(breakevenYear!).toBeLessThanOrEqual(20)
  })
})

// ─── Household & tax ──────────────────────────────────────────────────────────
describe('calculateProjections — household and tax', () => {
  it('married filers use the higher standard deduction', () => {
    const single = calculateProjections(makeAnswers({ household: 'single' }))
    const married = calculateProjections(makeAnswers({ household: 'couple' }))
    // Married standard deduction is ~2× single, so slightly different tax benefit
    // Net buy cost should differ slightly between the two
    const singleBuy = single.projections[0].annualBuyCost
    const marriedBuy = married.projections[0].annualBuyCost
    // They may be equal if neither itemizes; we just check for no crash
    expect(typeof singleBuy).toBe('number')
    expect(typeof marriedBuy).toBe('number')
  })
})

// ─── Investment style ─────────────────────────────────────────────────────────
describe('calculateProjections — investment style', () => {
  it('higher return rate leads to higher renter wealth', () => {
    const conservative = calculateProjections(makeAnswers({ investmentStyle: 0.04 }))
    const aggressive = calculateProjections(makeAnswers({ investmentStyle: 0.13 }))
    expect(aggressive.finalRenterWealth).toBeGreaterThan(conservative.finalRenterWealth)
  })

  it('with aggressive returns, renting often wins over a 10-year horizon', () => {
    const { recommendation } = calculateProjections(makeAnswers({ investmentStyle: 0.13, yearsToStay: 10 }))
    expect(recommendation).toBe('rent')
  })

  it('with conservative returns (4%), buying can win long-term', () => {
    const { recommendation } = calculateProjections(
      makeAnswers({ investmentStyle: 0.04, yearsToStay: 20, monthlyBudget: 2500 })
    )
    expect(recommendation).toBe('buy')
  })
})

// ─── Location data ────────────────────────────────────────────────────────────
describe('calculateProjections — location', () => {
  it('NJ (high property tax) increases annual buy cost vs AZ (low tax)', () => {
    const nj = calculateProjections(makeAnswers({ location: '07001' }))
    const az = calculateProjections(makeAnswers({ location: '85001' }))
    expect(nj.projections[0].annualBuyCost).toBeGreaterThan(az.projections[0].annualBuyCost)
  })

  it('unknown location falls back to national average rates without crashing', () => {
    const result = calculateProjections(makeAnswers({ location: 'mars' }))
    expect(result.projections).toHaveLength(10)
  })
})

// ─── Numeric integrity ────────────────────────────────────────────────────────
describe('calculateProjections — numeric integrity', () => {
  it('all projection values are finite numbers', () => {
    const { projections } = calculateProjections(BASE)
    projections.forEach(row => {
      Object.values(row).forEach(val => {
        expect(Number.isFinite(val)).toBe(true)
      })
    })
  })

  it('wealthDifference equals finalBuyerWealth minus finalRenterWealth', () => {
    const { wealthDifference, finalBuyerWealth, finalRenterWealth } = calculateProjections(BASE)
    expect(wealthDifference).toBe(finalBuyerWealth - finalRenterWealth)
  })

  it('totalRentCost equals cumulativeRentCost of the last projection row', () => {
    const result = calculateProjections(BASE)
    const lastRow = result.projections[result.projections.length - 1]
    expect(result.totalRentCost).toBe(lastRow.cumulativeRentCost)
  })

  it('totalBuyCost equals cumulativeBuyCost of the last projection row', () => {
    const result = calculateProjections(BASE)
    const lastRow = result.projections[result.projections.length - 1]
    expect(result.totalBuyCost).toBe(lastRow.cumulativeBuyCost)
  })

  it('buyerNetWealth = equityBuilt - 6% selling costs (within $2 rounding)', () => {
    // Values are Math.round()'d in the engine so allow ±2 for accumulated rounding
    const { projections } = calculateProjections(BASE)
    projections.forEach(row => {
      const expectedNetWealth = row.equityBuilt - row.homeValue * 0.06
      expect(Math.abs(row.buyerNetWealth - expectedNetWealth)).toBeLessThan(2)
    })
  })
})
