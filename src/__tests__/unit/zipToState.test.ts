/**
 * Unit tests for the zip code → state mapping utility.
 * Verifies zipToState(), isValidZip(), and the ZIP_PREFIX_TO_STATE mapping.
 */
import { describe, it, expect } from 'vitest'
import { zipToState, isValidZip, ZIP_PREFIX_TO_STATE } from '../../lib/zipToState'

describe('zipToState', () => {
  it('maps well-known zip codes to correct states', () => {
    expect(zipToState('10001')).toBe('NY') // Manhattan
    expect(zipToState('90210')).toBe('CA') // Beverly Hills
    expect(zipToState('60601')).toBe('IL') // Chicago
    expect(zipToState('33101')).toBe('FL') // Miami
    expect(zipToState('85001')).toBe('AZ') // Phoenix
    expect(zipToState('02101')).toBe('MA') // Boston
    expect(zipToState('20001')).toBe('DC') // Washington DC
    expect(zipToState('75201')).toBe('TX') // Dallas
    expect(zipToState('98101')).toBe('WA') // Seattle
    expect(zipToState('80201')).toBe('CO') // Denver
  })

  it('returns null for non-5-digit inputs', () => {
    expect(zipToState('1234')).toBeNull()
    expect(zipToState('123456')).toBeNull()
    expect(zipToState('')).toBeNull()
    expect(zipToState('abcde')).toBeNull()
    expect(zipToState('1234a')).toBeNull()
  })

  it('returns null for 00000 (no valid prefix)', () => {
    expect(zipToState('00000')).toBeNull()
  })

  it('returns null for territory zip codes (PR, GU)', () => {
    // PR: prefixes 006-009
    expect(zipToState('00901')).toBeNull()
    // GU: prefix 969
    expect(zipToState('96910')).toBeNull()
  })

  it('returns null for military APO/FPO zip codes', () => {
    // APO/FPO AA: 340
    expect(zipToState('34001')).toBeNull()
    // APO/FPO AE: 090-098
    expect(zipToState('09001')).toBeNull()
  })

  it('handles boundary prefixes correctly', () => {
    // First valid prefix for MA: 010
    expect(zipToState('01001')).toBe('MA')
    // Last valid prefix for AK: 999
    expect(zipToState('99901')).toBe('AK')
  })
})

describe('isValidZip', () => {
  it('returns true for valid US state zip codes', () => {
    expect(isValidZip('10001')).toBe(true)
    expect(isValidZip('90210')).toBe(true)
    expect(isValidZip('60601')).toBe(true)
  })

  it('returns false for invalid inputs', () => {
    expect(isValidZip('1234')).toBe(false)
    expect(isValidZip('')).toBe(false)
    expect(isValidZip('abcde')).toBe(false)
    expect(isValidZip('00000')).toBe(false)
  })

  it('returns false for territory zip codes', () => {
    expect(isValidZip('00901')).toBe(false) // PR
  })
})

describe('ZIP_PREFIX_TO_STATE mapping', () => {
  it('has entries for all major state prefixes', () => {
    // Spot-check that key state prefixes exist
    expect(ZIP_PREFIX_TO_STATE['100']).toBe('NY')
    expect(ZIP_PREFIX_TO_STATE['900']).toBe('CA')
    expect(ZIP_PREFIX_TO_STATE['606']).toBe('IL')
    expect(ZIP_PREFIX_TO_STATE['331']).toBe('FL')
    expect(ZIP_PREFIX_TO_STATE['750']).toBe('TX')
  })

  it('covers all 50 states + DC', () => {
    const allStates = new Set(Object.values(ZIP_PREFIX_TO_STATE))
    const expected = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
      'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
      'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
      'WY',
    ]
    for (const state of expected) {
      expect(allStates.has(state)).toBe(true)
    }
  })
})
