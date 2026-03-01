/**
 * Maps US zip code prefixes (first 3 digits) to 2-letter state abbreviations.
 * Based on official USPS zip code prefix assignments.
 *
 * Pure TypeScript — no React imports.
 */

function range(start: number, end: number, state: string): [string, string][] {
  const entries: [string, string][] = []
  for (let i = start; i <= end; i++) {
    entries.push([String(i).padStart(3, '0'), state])
  }
  return entries
}

export const ZIP_PREFIX_TO_STATE: Record<string, string> = Object.fromEntries([
  // New York (GI addresses)
  ...range(5, 5, 'NY'),

  // Puerto Rico — mapped to 'PR'
  ...range(6, 9, 'PR'),

  // Massachusetts
  ...range(10, 27, 'MA'),

  // Rhode Island
  ...range(28, 29, 'RI'),

  // New Hampshire
  ...range(30, 38, 'NH'),

  // Maine
  ...range(39, 49, 'ME'),

  // Vermont
  ...range(50, 59, 'VT'),

  // Connecticut
  ...range(60, 69, 'CT'),

  // New Jersey
  ...range(70, 89, 'NJ'),

  // New York
  ...range(100, 149, 'NY'),

  // Pennsylvania
  ...range(150, 196, 'PA'),

  // Delaware
  ...range(197, 199, 'DE'),

  // District of Columbia
  ...range(200, 205, 'DC'),

  // Maryland
  ...range(206, 219, 'MD'),

  // Virginia
  ...range(220, 246, 'VA'),

  // West Virginia
  ...range(247, 268, 'WV'),

  // North Carolina
  ...range(270, 289, 'NC'),

  // South Carolina
  ...range(290, 299, 'SC'),

  // Georgia
  ...range(300, 319, 'GA'),

  // Florida
  ...range(320, 339, 'FL'),

  // 340-349: AA (military) — skipped, returns null

  // Alabama
  ...range(350, 369, 'AL'),

  // Tennessee
  ...range(370, 385, 'TN'),

  // Mississippi
  ...range(386, 397, 'MS'),

  // Georgia (additional range)
  ...range(398, 399, 'GA'),

  // Kentucky
  ...range(400, 427, 'KY'),

  // Ohio
  ...range(430, 459, 'OH'),

  // Indiana
  ...range(460, 479, 'IN'),

  // Michigan
  ...range(480, 499, 'MI'),

  // Iowa
  ...range(500, 528, 'IA'),

  // Wisconsin
  ...range(530, 549, 'WI'),

  // Minnesota
  ...range(550, 567, 'MN'),

  // South Dakota
  ...range(570, 577, 'SD'),

  // North Dakota
  ...range(580, 588, 'ND'),

  // Montana
  ...range(590, 599, 'MT'),

  // Illinois
  ...range(600, 629, 'IL'),

  // Missouri
  ...range(630, 658, 'MO'),

  // Kansas
  ...range(660, 679, 'KS'),

  // Nebraska
  ...range(680, 693, 'NE'),

  // Louisiana
  ...range(700, 714, 'LA'),

  // Arkansas
  ...range(716, 729, 'AR'),

  // Oklahoma
  ...range(730, 749, 'OK'),

  // Texas
  ...range(750, 799, 'TX'),

  // Colorado
  ...range(800, 816, 'CO'),

  // Wyoming
  ...range(820, 831, 'WY'),

  // Idaho
  ...range(832, 838, 'ID'),

  // Utah
  ...range(840, 847, 'UT'),

  // Arizona
  ...range(850, 865, 'AZ'),

  // New Mexico
  ...range(870, 884, 'NM'),

  // Nevada
  ...range(889, 898, 'NV'),

  // California
  ...range(900, 961, 'CA'),

  // 962-966: APO/FPO military — skipped, returns null

  // Hawaii
  ...range(967, 968, 'HI'),

  // 969: GU (Guam) — skipped, returns null

  // Oregon
  ...range(970, 979, 'OR'),

  // Washington
  ...range(980, 994, 'WA'),

  // Alaska
  ...range(995, 999, 'AK'),
])

// Set of state abbreviations we consider valid (50 states + DC)
const VALID_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
  'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
  'WY',
])

/**
 * Takes a 5-digit zip code string, extracts the first 3 digits,
 * and returns the corresponding 2-letter state abbreviation.
 *
 * Returns null if:
 * - The input is not exactly 5 digits
 * - The prefix does not map to a known state
 * - The prefix maps to a territory or military address (PR, AA, GU, APO)
 */
export function zipToState(zip: string): string | null {
  if (!/^\d{5}$/.test(zip)) {
    return null
  }

  const prefix = zip.substring(0, 3)
  const state = ZIP_PREFIX_TO_STATE[prefix]

  if (!state || !VALID_STATES.has(state)) {
    return null
  }

  return state
}

/**
 * Returns true if the string is exactly 5 digits AND maps to a known US state (50 states + DC).
 */
export function isValidZip(zip: string): boolean {
  return zipToState(zip) !== null
}
