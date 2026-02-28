export type AppView = 'landing' | 'wizard' | 'results'

export interface QuestionOption {
  label: string
  value: number | string
  description?: string
}

/** Config for the freeform custom-value input shown below the option cards */
export interface CustomInputConfig {
  type: 'dollar' | 'percent' | 'years'
  label: string   // e.g. "Or enter an exact amount"
  min: number
  max: number
  step?: number
}

export interface Question {
  id: keyof WizardAnswers
  title: string
  subtitle: string
  options: QuestionOption[]
  /** When present, renders a custom-value text input below the option cards */
  customInput?: CustomInputConfig
}

export interface LocationData {
  propertyTaxRate: number
  insuranceRate: number
}

export interface WizardAnswers {
  annualIncome: number
  monthlyBudget: number
  downPayment: number
  homePrice: number
  investmentStyle: number // return rate as decimal (e.g., 0.04)
  yearsToStay: number
  bigExpenses: number
  location: string
  totalSavings: number
  household: string
}

/** Six rates the user can override from the results dashboard */
export interface AssumptionOverrides {
  mortgageRate: number       // decimal, e.g. 0.06
  homeAppreciation: number   // decimal, e.g. 0.02
  rentAppreciation: number   // decimal, e.g. 0.03
  maintenance: number        // decimal, e.g. 0.01
  closingCostsBuy: number    // decimal, e.g. 0.03
  sellingCosts: number       // decimal, e.g. 0.06
}

export interface YearProjection {
  year: number
  // Rent scenario
  monthlyRent: number
  annualRentCost: number
  cumulativeRentCost: number
  renterInvestmentBalance: number
  renterNetWealth: number
  // Buy scenario
  monthlyMortgage: number
  annualBuyCost: number
  cumulativeBuyCost: number
  homeValue: number
  remainingMortgage: number
  equityBuilt: number
  buyerNetWealth: number // equity - selling costs
  // Deltas
  monthlySavingsIfRenting: number
  buyAdvantage: number // positive = buying is better
}

export interface ProjectionResult {
  projections: YearProjection[]
  recommendation: 'buy' | 'rent'
  breakevenYear: number | null // null if buying never catches up
  totalBuyCost: number
  totalRentCost: number
  finalBuyerWealth: number
  finalRenterWealth: number
  wealthDifference: number // positive = buying builds more wealth
  monthlyMortgagePayment: number
  totalInterestPaid: number
  summary: string
}
