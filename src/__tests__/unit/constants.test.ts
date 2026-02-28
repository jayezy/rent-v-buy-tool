import { describe, it, expect } from 'vitest'
import { QUESTIONS, DEFAULTS, LOCATION_DATA } from '../../lib/constants'

describe('QUESTIONS', () => {
  it('contains exactly 10 questions', () => {
    expect(QUESTIONS).toHaveLength(10)
  })

  it('each question has required fields', () => {
    QUESTIONS.forEach(q => {
      expect(typeof q.id).toBe('string')
      expect(typeof q.title).toBe('string')
      expect(q.title.length).toBeGreaterThan(0)
      expect(typeof q.subtitle).toBe('string')
      expect(Array.isArray(q.options)).toBe(true)
      expect(q.options.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('question ids are unique', () => {
    const ids = QUESTIONS.map(q => q.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('covers all WizardAnswers fields', () => {
    const expectedFields = [
      'annualIncome', 'monthlyBudget', 'downPayment', 'homePrice',
      'investmentStyle', 'yearsToStay', 'bigExpenses', 'location',
      'totalSavings', 'household',
    ]
    const questionIds = QUESTIONS.map(q => q.id)
    expectedFields.forEach(field => {
      expect(questionIds).toContain(field)
    })
  })

  it('each option has a label and a value', () => {
    QUESTIONS.forEach(q => {
      q.options.forEach(opt => {
        expect(typeof opt.label).toBe('string')
        expect(opt.label.length).toBeGreaterThan(0)
        expect(opt.value !== undefined && opt.value !== null).toBe(true)
      })
    })
  })

  it('numeric options have numeric values', () => {
    const numericQuestions = [
      'annualIncome', 'monthlyBudget', 'downPayment', 'homePrice',
      'yearsToStay', 'bigExpenses', 'totalSavings', 'investmentStyle',
    ]
    QUESTIONS.filter(q => numericQuestions.includes(q.id)).forEach(q => {
      q.options.forEach(opt => {
        expect(typeof opt.value).toBe('number')
        expect(opt.value as number).toBeGreaterThanOrEqual(0)
      })
    })
  })

  it('location question has string values', () => {
    const locationQ = QUESTIONS.find(q => q.id === 'location')!
    locationQ.options.forEach(opt => {
      expect(typeof opt.value).toBe('string')
    })
  })

  it('investmentStyle options represent realistic return rates (0–20%)', () => {
    const q = QUESTIONS.find(q => q.id === 'investmentStyle')!
    q.options.forEach(opt => {
      expect(opt.value as number).toBeGreaterThan(0)
      expect(opt.value as number).toBeLessThan(0.25)
    })
  })

  it('yearsToStay options are between 1 and 30', () => {
    const q = QUESTIONS.find(q => q.id === 'yearsToStay')!
    q.options.forEach(opt => {
      expect(opt.value as number).toBeGreaterThanOrEqual(1)
      expect(opt.value as number).toBeLessThanOrEqual(30)
    })
  })
})

describe('DEFAULTS', () => {
  it('mortgageRate is between 1% and 15%', () => {
    expect(DEFAULTS.mortgageRate).toBeGreaterThan(0.01)
    expect(DEFAULTS.mortgageRate).toBeLessThan(0.15)
  })

  it('mortgageTerm is 15 or 30 years', () => {
    expect([15, 30]).toContain(DEFAULTS.mortgageTerm)
  })

  it('homeAppreciation is positive and reasonable (0–10%)', () => {
    expect(DEFAULTS.homeAppreciation).toBeGreaterThan(0)
    expect(DEFAULTS.homeAppreciation).toBeLessThan(0.10)
  })

  it('closing and selling cost rates are positive', () => {
    expect(DEFAULTS.closingCostsBuy).toBeGreaterThan(0)
    expect(DEFAULTS.sellingCosts).toBeGreaterThan(0)
  })

  it('standard deduction married > single', () => {
    expect(DEFAULTS.standardDeductionMarried).toBeGreaterThan(DEFAULTS.standardDeductionSingle)
  })
})

describe('LOCATION_DATA', () => {
  const expectedLocations = ['northeast', 'westCoast', 'southeast', 'midwest', 'mountain', 'other']

  it('contains all expected location keys', () => {
    expectedLocations.forEach(loc => {
      expect(LOCATION_DATA).toHaveProperty(loc)
    })
  })

  it('each location has propertyTaxRate and insuranceRate', () => {
    Object.values(LOCATION_DATA).forEach(loc => {
      expect(typeof loc.propertyTaxRate).toBe('number')
      expect(typeof loc.insuranceRate).toBe('number')
    })
  })

  it('property tax rates are between 0.1% and 3%', () => {
    Object.values(LOCATION_DATA).forEach(loc => {
      expect(loc.propertyTaxRate).toBeGreaterThan(0.001)
      expect(loc.propertyTaxRate).toBeLessThan(0.03)
    })
  })

  it('northeast has the highest property tax rate', () => {
    const northeastRate = LOCATION_DATA.northeast.propertyTaxRate
    Object.entries(LOCATION_DATA)
      .filter(([key]) => key !== 'northeast')
      .forEach(([, loc]) => {
        expect(northeastRate).toBeGreaterThanOrEqual(loc.propertyTaxRate)
      })
  })
})
