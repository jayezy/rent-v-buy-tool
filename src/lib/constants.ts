import type { Question, LocationData } from './types'

// Current market rates (Feb 2026)
export const DEFAULTS = {
  mortgageRate: 0.06,         // 6.0% — 30-year fixed (Freddie Mac avg)
  mortgageTerm: 30,           // years
  homeAppreciation: 0.02,     // 2.0%/yr (Zillow 2026 forecast)
  rentAppreciation: 0.03,     // 3.0%/yr (national average)
  maintenance: 0.01,          // 1.0% of home value/yr
  closingCostsBuy: 0.03,      // 3% of home price
  sellingCosts: 0.06,         // 6% of home value at sale
  standardDeductionSingle: 14600,
  standardDeductionMarried: 29200,
} as const

export const LOCATION_DATA: Record<string, LocationData> = {
  northeast:  { propertyTaxRate: 0.018, insuranceRate: 0.006 },
  westCoast:  { propertyTaxRate: 0.010, insuranceRate: 0.004 },
  southeast:  { propertyTaxRate: 0.012, insuranceRate: 0.007 },
  midwest:    { propertyTaxRate: 0.016, insuranceRate: 0.005 },
  mountain:   { propertyTaxRate: 0.008, insuranceRate: 0.005 },
  other:      { propertyTaxRate: 0.012, insuranceRate: 0.005 },
}

export const QUESTIONS: Question[] = [
  {
    id: 'annualIncome',
    title: "What's your annual household income?",
    subtitle: 'This helps us estimate your tax bracket and mortgage interest deduction benefit.',
    options: [
      { label: 'Under $50K', value: 40000 },
      { label: '$50K – $75K', value: 62500 },
      { label: '$75K – $100K', value: 87500 },
      { label: '$100K – $150K', value: 125000 },
      { label: '$150K – $250K', value: 200000 },
      { label: '$250K+', value: 300000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter exact income', min: 0, max: 10000000 },
  },
  {
    id: 'monthlyBudget',
    title: 'How much can you spend on housing each month?',
    subtitle: 'Include rent or mortgage payment, not utilities.',
    options: [
      { label: 'Under $1,500', value: 1250 },
      { label: '$1,500 – $2,500', value: 2000 },
      { label: '$2,500 – $3,500', value: 3000 },
      { label: '$3,500 – $5,000', value: 4250 },
      { label: '$5,000 – $7,500', value: 6250 },
      { label: '$7,500+', value: 9000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter exact monthly amount', min: 0, max: 100000 },
  },
  {
    id: 'downPayment',
    title: 'How much have you saved for a down payment?',
    subtitle: 'Cash you could put toward buying a home today.',
    options: [
      { label: 'Under $25K', value: 20000 },
      { label: '$25K – $50K', value: 37500 },
      { label: '$50K – $100K', value: 75000 },
      { label: '$100K – $200K', value: 150000 },
      { label: '$200K – $500K', value: 350000 },
      { label: '$500K+', value: 600000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter exact savings', min: 0, max: 10000000 },
  },
  {
    id: 'homePrice',
    title: 'What home price range are you considering?',
    subtitle: "The typical price of homes you're looking at.",
    options: [
      { label: 'Under $250K', value: 200000 },
      { label: '$250K – $400K', value: 325000 },
      { label: '$400K – $600K', value: 500000 },
      { label: '$600K – $1M', value: 800000 },
      { label: '$1M – $1.5M', value: 1250000 },
      { label: '$1.5M+', value: 1750000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter exact home price', min: 0, max: 20000000 },
  },
  {
    id: 'investmentStyle',
    title: 'If you keep renting, how would you invest your savings?',
    subtitle: "The money you'd save by not buying would be invested. What's your style?",
    options: [
      { label: 'CDs / Savings account', value: 0.04, description: 'Safe, ~4% return' },
      { label: 'Index funds', value: 0.07, description: 'Moderate, ~7% return' },
      { label: 'Stocks', value: 0.10, description: 'Aggressive, ~10% return' },
      { label: 'Crypto / High-risk', value: 0.13, description: 'Very aggressive, ~13% return' },
    ],
    customInput: { type: 'percent', label: 'Or enter expected annual return %', min: 0, max: 30 },
  },
  {
    id: 'yearsToStay',
    title: 'How long do you plan to stay?',
    subtitle: 'Buying makes more sense the longer you stay put.',
    options: [
      { label: '2–3 years', value: 3 },
      { label: '3–5 years', value: 5 },
      { label: '5–7 years', value: 7 },
      { label: '7–10 years', value: 10 },
      { label: '10–15 years', value: 15 },
      { label: '15+ years', value: 20 },
    ],
    customInput: { type: 'years', label: 'Or enter exact number of years', min: 1, max: 50 },
  },
  {
    id: 'bigExpenses',
    title: 'Any big expenses coming up in the next few years?',
    subtitle: 'This reduces the savings available for a down payment.',
    options: [
      { label: 'None planned', value: 0 },
      { label: 'Car ($25–50K)', value: 37500 },
      { label: 'Education', value: 50000, description: "Grad school, kids' college, etc." },
      { label: 'Wedding', value: 35000 },
      { label: 'Medical', value: 30000 },
      { label: 'Multiple big expenses', value: 75000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter custom amount', min: 0, max: 2000000 },
  },
  {
    id: 'location',
    // No customInput — location maps to tax rate lookup keys
    title: 'Where are you looking to live?',
    subtitle: 'This determines property tax and insurance rates.',
    options: [
      { label: 'Northeast', value: 'northeast', description: 'NY, NJ, CT, MA' },
      { label: 'West Coast', value: 'westCoast', description: 'CA, WA, OR' },
      { label: 'Southeast', value: 'southeast', description: 'FL, TX, GA, NC' },
      { label: 'Midwest', value: 'midwest', description: 'IL, OH, MI, MN' },
      { label: 'Mountain West', value: 'mountain', description: 'CO, AZ, UT, NV' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    id: 'totalSavings',
    title: 'What are your total savings beyond the down payment?',
    subtitle: 'Emergency fund, retirement accounts, investments — everything else.',
    options: [
      { label: 'Under $25K', value: 15000 },
      { label: '$25K – $75K', value: 50000 },
      { label: '$75K – $200K', value: 137500 },
      { label: '$200K – $500K', value: 350000 },
      { label: '$500K – $1M', value: 750000 },
      { label: '$1M+', value: 1250000 },
    ],
    customInput: { type: 'dollar', label: 'Or enter exact total savings', min: 0, max: 50000000 },
  },
  {
    id: 'household',
    // No customInput — household is categorical
    title: "What's your household situation?",
    subtitle: 'Families often value stability more, which favors buying.',
    options: [
      { label: 'Single, no dependents', value: 'single' },
      { label: 'Couple, no kids', value: 'couple' },
      { label: 'Family with kids', value: 'family' },
      { label: 'Planning to start a family', value: 'planning' },
      { label: 'Retired / near-retirement', value: 'retired' },
    ],
  },
]
