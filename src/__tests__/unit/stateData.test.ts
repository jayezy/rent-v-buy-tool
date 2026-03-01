/**
 * Unit tests for the state-level housing data module.
 * Verifies STATE_DATA completeness, getLocationData() lookups, and fallback behavior.
 */
import { describe, it, expect } from 'vitest'
import { STATE_DATA, NATIONAL_AVERAGE, getLocationData } from '../../lib/stateData'

describe('STATE_DATA', () => {
  const allEntries = Object.entries(STATE_DATA)

  it('contains all 50 states + DC (51 entries)', () => {
    expect(allEntries).toHaveLength(51)
  })

  it('has entries for all expected state abbreviations', () => {
    const expected = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
      'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
      'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
      'WY',
    ]
    for (const abbr of expected) {
      expect(STATE_DATA[abbr]).toBeDefined()
    }
  })

  it('each entry has valid property tax rate (between 0.1% and 3%)', () => {
    for (const [abbr, data] of allEntries) {
      expect(data.propertyTaxRate).toBeGreaterThanOrEqual(0.001)
      expect(data.propertyTaxRate).toBeLessThanOrEqual(0.03)
    }
  })

  it('each entry has valid insurance rate (between 0.1% and 2%)', () => {
    for (const [abbr, data] of allEntries) {
      expect(data.insuranceRate).toBeGreaterThanOrEqual(0.001)
      expect(data.insuranceRate).toBeLessThanOrEqual(0.02)
    }
  })

  it('each entry has matching stateAbbr key', () => {
    for (const [key, data] of allEntries) {
      expect(data.stateAbbr).toBe(key)
    }
  })

  it('each entry has a non-empty stateName', () => {
    for (const [, data] of allEntries) {
      expect(data.stateName.length).toBeGreaterThan(0)
    }
  })

  it('known states have expected rates', () => {
    // NJ has one of the highest property tax rates
    expect(STATE_DATA['NJ'].propertyTaxRate).toBeGreaterThan(0.02)
    // Hawaii has one of the lowest property tax rates
    expect(STATE_DATA['HI'].propertyTaxRate).toBeLessThan(0.004)
  })
})

describe('NATIONAL_AVERAGE', () => {
  it('has a reasonable property tax rate', () => {
    expect(NATIONAL_AVERAGE.propertyTaxRate).toBeGreaterThan(0.005)
    expect(NATIONAL_AVERAGE.propertyTaxRate).toBeLessThan(0.02)
  })

  it('has a reasonable insurance rate', () => {
    expect(NATIONAL_AVERAGE.insuranceRate).toBeGreaterThan(0.003)
    expect(NATIONAL_AVERAGE.insuranceRate).toBeLessThan(0.015)
  })
})

describe('getLocationData', () => {
  it('returns correct data for a valid zip code', () => {
    const data = getLocationData('90210') // CA
    expect(data.propertyTaxRate).toBe(STATE_DATA['CA'].propertyTaxRate)
    expect(data.insuranceRate).toBe(STATE_DATA['CA'].insuranceRate)
  })

  it('returns correct data for different state zip codes', () => {
    const ny = getLocationData('10001') // NY
    expect(ny.propertyTaxRate).toBe(STATE_DATA['NY'].propertyTaxRate)

    const tx = getLocationData('75201') // TX
    expect(tx.propertyTaxRate).toBe(STATE_DATA['TX'].propertyTaxRate)

    const il = getLocationData('60601') // IL
    expect(il.propertyTaxRate).toBe(STATE_DATA['IL'].propertyTaxRate)
  })

  it('returns correct data for a 2-letter state abbreviation', () => {
    const data = getLocationData('CA')
    expect(data.propertyTaxRate).toBe(STATE_DATA['CA'].propertyTaxRate)
    expect(data.insuranceRate).toBe(STATE_DATA['CA'].insuranceRate)
  })

  it('handles lowercase state abbreviation', () => {
    const data = getLocationData('ca')
    expect(data.propertyTaxRate).toBe(STATE_DATA['CA'].propertyTaxRate)
  })

  it('returns national average for legacy region keys', () => {
    const westCoast = getLocationData('westCoast')
    expect(westCoast.propertyTaxRate).toBe(NATIONAL_AVERAGE.propertyTaxRate)
    expect(westCoast.insuranceRate).toBe(NATIONAL_AVERAGE.insuranceRate)

    const northeast = getLocationData('northeast')
    expect(northeast.propertyTaxRate).toBe(NATIONAL_AVERAGE.propertyTaxRate)
  })

  it('returns national average for invalid zip codes', () => {
    const data = getLocationData('00000')
    expect(data.propertyTaxRate).toBe(NATIONAL_AVERAGE.propertyTaxRate)
    expect(data.insuranceRate).toBe(NATIONAL_AVERAGE.insuranceRate)
  })

  it('returns national average for empty string', () => {
    const data = getLocationData('')
    expect(data.propertyTaxRate).toBe(NATIONAL_AVERAGE.propertyTaxRate)
  })

  it('returns national average for random text', () => {
    const data = getLocationData('foobar')
    expect(data.propertyTaxRate).toBe(NATIONAL_AVERAGE.propertyTaxRate)
  })

  it('returns a copy of national average (not the same reference)', () => {
    const a = getLocationData('westCoast')
    const b = getLocationData('westCoast')
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})
