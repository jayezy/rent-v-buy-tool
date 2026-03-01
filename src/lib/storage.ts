import type { SavedResult, WizardAnswers } from './types'
import { zipToState } from './zipToState'
import { STATE_DATA } from './stateData'

export const STORAGE_KEY = 'homewise_results'

/** Legacy region labels for backward compatibility with old saved results */
const LEGACY_LOCATION_LABELS: Record<string, string> = {
  northeast: 'Northeast',
  westCoast: 'West Coast',
  southeast: 'Southeast',
  midwest: 'Midwest',
  mountain: 'Mountain',
  other: 'Other',
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

/** Resolve a location value (zip code or legacy key) to a display label */
function getLocationLabel(location: string): string {
  // Try legacy labels first (for old saved results)
  if (LEGACY_LOCATION_LABELS[location]) return LEGACY_LOCATION_LABELS[location]
  // Try zip code → state abbreviation
  const stateAbbr = zipToState(location)
  if (stateAbbr && STATE_DATA[stateAbbr]) return STATE_DATA[stateAbbr].stateAbbr
  return location
}

/** Build a human-readable label from answers, e.g. "$500K home · CA · 10yr" */
export function generateResultLabel(answers: WizardAnswers): string {
  const price = formatCompact(answers.homePrice)
  const location = getLocationLabel(answers.location)
  const years = `${answers.yearsToStay}yr`
  return `${price} home · ${location} · ${years}`
}

/** Read saved results from localStorage. Returns [] on missing/corrupt data. */
export function loadSavedResults(): SavedResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/** Write saved results to localStorage. */
export function saveSavedResults(results: SavedResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}
