// State-level housing data for all 50 US states + DC
// Sources: Approximate effective rates as of 2024-2025

import { zipToState } from './zipToState';

export interface StateData {
  stateAbbr: string;
  stateName: string;
  propertyTaxRate: number; // effective rate as decimal (e.g., 0.0247 = 2.47%)
  insuranceRate: number; // homeowner's insurance as % of home value (e.g., 0.0053 = 0.53%)
}

export const STATE_DATA: Record<string, StateData> = {
  AL: {
    stateAbbr: 'AL',
    stateName: 'Alabama',
    propertyTaxRate: 0.004,
    insuranceRate: 0.0097,
  },
  AK: {
    stateAbbr: 'AK',
    stateName: 'Alaska',
    propertyTaxRate: 0.0104,
    insuranceRate: 0.006,
  },
  AZ: {
    stateAbbr: 'AZ',
    stateName: 'Arizona',
    propertyTaxRate: 0.0062,
    insuranceRate: 0.0066,
  },
  AR: {
    stateAbbr: 'AR',
    stateName: 'Arkansas',
    propertyTaxRate: 0.0062,
    insuranceRate: 0.0126,
  },
  CA: {
    stateAbbr: 'CA',
    stateName: 'California',
    propertyTaxRate: 0.0071,
    insuranceRate: 0.0039,
  },
  CO: {
    stateAbbr: 'CO',
    stateName: 'Colorado',
    propertyTaxRate: 0.0051,
    insuranceRate: 0.0114,
  },
  CT: {
    stateAbbr: 'CT',
    stateName: 'Connecticut',
    propertyTaxRate: 0.0215,
    insuranceRate: 0.0058,
  },
  DE: {
    stateAbbr: 'DE',
    stateName: 'Delaware',
    propertyTaxRate: 0.0057,
    insuranceRate: 0.0044,
  },
  DC: {
    stateAbbr: 'DC',
    stateName: 'District of Columbia',
    propertyTaxRate: 0.0056,
    insuranceRate: 0.0036,
  },
  FL: {
    stateAbbr: 'FL',
    stateName: 'Florida',
    propertyTaxRate: 0.0089,
    insuranceRate: 0.0077,
  },
  GA: {
    stateAbbr: 'GA',
    stateName: 'Georgia',
    propertyTaxRate: 0.0092,
    insuranceRate: 0.0095,
  },
  HI: {
    stateAbbr: 'HI',
    stateName: 'Hawaii',
    propertyTaxRate: 0.0028,
    insuranceRate: 0.0025,
  },
  ID: {
    stateAbbr: 'ID',
    stateName: 'Idaho',
    propertyTaxRate: 0.0063,
    insuranceRate: 0.0073,
  },
  IL: {
    stateAbbr: 'IL',
    stateName: 'Illinois',
    propertyTaxRate: 0.0223,
    insuranceRate: 0.0083,
  },
  IN: {
    stateAbbr: 'IN',
    stateName: 'Indiana',
    propertyTaxRate: 0.0085,
    insuranceRate: 0.0087,
  },
  IA: {
    stateAbbr: 'IA',
    stateName: 'Iowa',
    propertyTaxRate: 0.0157,
    insuranceRate: 0.0092,
  },
  KS: {
    stateAbbr: 'KS',
    stateName: 'Kansas',
    propertyTaxRate: 0.0141,
    insuranceRate: 0.0135,
  },
  KY: {
    stateAbbr: 'KY',
    stateName: 'Kentucky',
    propertyTaxRate: 0.0086,
    insuranceRate: 0.0099,
  },
  LA: {
    stateAbbr: 'LA',
    stateName: 'Louisiana',
    propertyTaxRate: 0.0055,
    insuranceRate: 0.0117,
  },
  ME: {
    stateAbbr: 'ME',
    stateName: 'Maine',
    propertyTaxRate: 0.0136,
    insuranceRate: 0.0062,
  },
  MD: {
    stateAbbr: 'MD',
    stateName: 'Maryland',
    propertyTaxRate: 0.0109,
    insuranceRate: 0.0054,
  },
  MA: {
    stateAbbr: 'MA',
    stateName: 'Massachusetts',
    propertyTaxRate: 0.0123,
    insuranceRate: 0.0057,
  },
  MI: {
    stateAbbr: 'MI',
    stateName: 'Michigan',
    propertyTaxRate: 0.0154,
    insuranceRate: 0.009,
  },
  MN: {
    stateAbbr: 'MN',
    stateName: 'Minnesota',
    propertyTaxRate: 0.0112,
    insuranceRate: 0.0104,
  },
  MS: {
    stateAbbr: 'MS',
    stateName: 'Mississippi',
    propertyTaxRate: 0.0081,
    insuranceRate: 0.0119,
  },
  MO: {
    stateAbbr: 'MO',
    stateName: 'Missouri',
    propertyTaxRate: 0.0097,
    insuranceRate: 0.0112,
  },
  MT: {
    stateAbbr: 'MT',
    stateName: 'Montana',
    propertyTaxRate: 0.0084,
    insuranceRate: 0.0101,
  },
  NE: {
    stateAbbr: 'NE',
    stateName: 'Nebraska',
    propertyTaxRate: 0.0173,
    insuranceRate: 0.013,
  },
  NV: {
    stateAbbr: 'NV',
    stateName: 'Nevada',
    propertyTaxRate: 0.0055,
    insuranceRate: 0.0048,
  },
  NH: {
    stateAbbr: 'NH',
    stateName: 'New Hampshire',
    propertyTaxRate: 0.0218,
    insuranceRate: 0.0052,
  },
  NJ: {
    stateAbbr: 'NJ',
    stateName: 'New Jersey',
    propertyTaxRate: 0.0247,
    insuranceRate: 0.0053,
  },
  NM: {
    stateAbbr: 'NM',
    stateName: 'New Mexico',
    propertyTaxRate: 0.008,
    insuranceRate: 0.0072,
  },
  NY: {
    stateAbbr: 'NY',
    stateName: 'New York',
    propertyTaxRate: 0.0172,
    insuranceRate: 0.0056,
  },
  NC: {
    stateAbbr: 'NC',
    stateName: 'North Carolina',
    propertyTaxRate: 0.0084,
    insuranceRate: 0.0078,
  },
  ND: {
    stateAbbr: 'ND',
    stateName: 'North Dakota',
    propertyTaxRate: 0.0098,
    insuranceRate: 0.0102,
  },
  OH: {
    stateAbbr: 'OH',
    stateName: 'Ohio',
    propertyTaxRate: 0.0156,
    insuranceRate: 0.0084,
  },
  OK: {
    stateAbbr: 'OK',
    stateName: 'Oklahoma',
    propertyTaxRate: 0.009,
    insuranceRate: 0.0147,
  },
  OR: {
    stateAbbr: 'OR',
    stateName: 'Oregon',
    propertyTaxRate: 0.0097,
    insuranceRate: 0.0033,
  },
  PA: {
    stateAbbr: 'PA',
    stateName: 'Pennsylvania',
    propertyTaxRate: 0.0158,
    insuranceRate: 0.007,
  },
  RI: {
    stateAbbr: 'RI',
    stateName: 'Rhode Island',
    propertyTaxRate: 0.0163,
    insuranceRate: 0.005,
  },
  SC: {
    stateAbbr: 'SC',
    stateName: 'South Carolina',
    propertyTaxRate: 0.0057,
    insuranceRate: 0.0086,
  },
  SD: {
    stateAbbr: 'SD',
    stateName: 'South Dakota',
    propertyTaxRate: 0.0122,
    insuranceRate: 0.0108,
  },
  TN: {
    stateAbbr: 'TN',
    stateName: 'Tennessee',
    propertyTaxRate: 0.0071,
    insuranceRate: 0.0082,
  },
  TX: {
    stateAbbr: 'TX',
    stateName: 'Texas',
    propertyTaxRate: 0.018,
    insuranceRate: 0.0122,
  },
  UT: {
    stateAbbr: 'UT',
    stateName: 'Utah',
    propertyTaxRate: 0.0058,
    insuranceRate: 0.0038,
  },
  VT: {
    stateAbbr: 'VT',
    stateName: 'Vermont',
    propertyTaxRate: 0.019,
    insuranceRate: 0.0046,
  },
  VA: {
    stateAbbr: 'VA',
    stateName: 'Virginia',
    propertyTaxRate: 0.0082,
    insuranceRate: 0.0064,
  },
  WA: {
    stateAbbr: 'WA',
    stateName: 'Washington',
    propertyTaxRate: 0.0103,
    insuranceRate: 0.0042,
  },
  WV: {
    stateAbbr: 'WV',
    stateName: 'West Virginia',
    propertyTaxRate: 0.0058,
    insuranceRate: 0.0076,
  },
  WI: {
    stateAbbr: 'WI',
    stateName: 'Wisconsin',
    propertyTaxRate: 0.0185,
    insuranceRate: 0.008,
  },
  WY: {
    stateAbbr: 'WY',
    stateName: 'Wyoming',
    propertyTaxRate: 0.0061,
    insuranceRate: 0.0068,
  },
};

export const NATIONAL_AVERAGE = {
  propertyTaxRate: 0.011,
  insuranceRate: 0.0075,
};

/**
 * Look up location-specific property tax and insurance rates.
 *
 * Accepts:
 *  - A 5-digit zip code (e.g., "10001") -- converted to a state abbreviation via zipToState
 *  - A 2-letter state abbreviation (e.g., "CA")
 *  - Anything else (e.g., legacy region keys like "westCoast") -- returns NATIONAL_AVERAGE
 */
export function getLocationData(location: string): {
  propertyTaxRate: number;
  insuranceRate: number;
} {
  const trimmed = location.trim();

  // Check if it's a 5-digit zip code
  if (/^\d{5}$/.test(trimmed)) {
    const stateAbbr = zipToState(trimmed);
    if (stateAbbr && STATE_DATA[stateAbbr]) {
      const data = STATE_DATA[stateAbbr];
      return {
        propertyTaxRate: data.propertyTaxRate,
        insuranceRate: data.insuranceRate,
      };
    }
    return { ...NATIONAL_AVERAGE };
  }

  // Check if it's a 2-letter state abbreviation
  const upper = trimmed.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper) && STATE_DATA[upper]) {
    const data = STATE_DATA[upper];
    return {
      propertyTaxRate: data.propertyTaxRate,
      insuranceRate: data.insuranceRate,
    };
  }

  // Fallback for legacy region keys or unrecognized input
  return { ...NATIONAL_AVERAGE };
}
