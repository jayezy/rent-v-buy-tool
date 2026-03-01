/**
 * Unit tests for the localStorage persistence layer.
 * Tests loadSavedResults, saveSavedResults, and generateResultLabel.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSavedResults,
  saveSavedResults,
  generateResultLabel,
  STORAGE_KEY,
} from '../../lib/storage'
import type { WizardAnswers, SavedResult, ProjectionResult } from '../../lib/types'

function makeAnswers(overrides: Partial<WizardAnswers> = {}): WizardAnswers {
  return {
    annualIncome: 125000,
    monthlyBudget: 3000,
    downPayment: 75000,
    homePrice: 500000,
    investmentStyle: 0.07,
    yearsToStay: 10,
    bigExpenses: 0,
    location: '90210',
    totalSavings: 137500,
    household: 'couple',
    ...overrides,
  }
}

function makeSavedResult(overrides: Partial<SavedResult> = {}): SavedResult {
  return {
    id: 'test-id-1',
    savedAt: Date.now(),
    label: '$500K home · CA · 10yr',
    answers: makeAnswers(),
    result: { recommendation: 'buy' } as ProjectionResult,
    assumptionOverrides: {},
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('loadSavedResults', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadSavedResults()).toEqual([])
  })

  it('returns empty array when stored value is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json{{{')
    expect(loadSavedResults()).toEqual([])
  })

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }))
    expect(loadSavedResults()).toEqual([])
  })

  it('returns parsed array when valid JSON array is stored', () => {
    const saved = [makeSavedResult()]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const loaded = loadSavedResults()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('test-id-1')
  })
})

describe('saveSavedResults', () => {
  it('writes valid JSON to localStorage', () => {
    const results = [makeSavedResult()]
    saveSavedResults(results)
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toHaveLength(1)
  })

  it('overwrites existing data', () => {
    saveSavedResults([makeSavedResult({ id: 'first' })])
    saveSavedResults([makeSavedResult({ id: 'second' })])
    const loaded = loadSavedResults()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('second')
  })
})

describe('round-trip persistence', () => {
  it('save then load returns the same data', () => {
    const original = [
      makeSavedResult({ id: 'a' }),
      makeSavedResult({ id: 'b' }),
    ]
    saveSavedResults(original)
    const loaded = loadSavedResults()
    expect(loaded).toHaveLength(2)
    expect(loaded[0].id).toBe('a')
    expect(loaded[1].id).toBe('b')
  })
})

describe('generateResultLabel', () => {
  it('formats a standard scenario correctly', () => {
    const label = generateResultLabel(makeAnswers())
    expect(label).toBe('$500K home · CA · 10yr')
  })

  it('handles million-dollar homes', () => {
    const label = generateResultLabel(makeAnswers({ homePrice: 1200000 }))
    expect(label).toBe('$1.2M home · CA · 10yr')
  })

  it('handles sub-thousand prices', () => {
    const label = generateResultLabel(makeAnswers({ homePrice: 500 }))
    expect(label).toBe('$500 home · CA · 10yr')
  })

  it('maps zip codes to state abbreviations', () => {
    expect(generateResultLabel(makeAnswers({ location: '10001' }))).toContain('NY')
    expect(generateResultLabel(makeAnswers({ location: '60601' }))).toContain('IL')
    expect(generateResultLabel(makeAnswers({ location: '33101' }))).toContain('FL')
    expect(generateResultLabel(makeAnswers({ location: '85001' }))).toContain('AZ')
  })

  it('maps legacy location codes to readable names for backward compatibility', () => {
    expect(generateResultLabel(makeAnswers({ location: 'northeast' }))).toContain('Northeast')
    expect(generateResultLabel(makeAnswers({ location: 'southeast' }))).toContain('Southeast')
    expect(generateResultLabel(makeAnswers({ location: 'midwest' }))).toContain('Midwest')
    expect(generateResultLabel(makeAnswers({ location: 'mountain' }))).toContain('Mountain')
    expect(generateResultLabel(makeAnswers({ location: 'other' }))).toContain('Other')
  })

  it('uses different year values', () => {
    expect(generateResultLabel(makeAnswers({ yearsToStay: 5 }))).toContain('5yr')
    expect(generateResultLabel(makeAnswers({ yearsToStay: 30 }))).toContain('30yr')
  })
})
