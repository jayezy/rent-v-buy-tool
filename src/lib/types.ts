export interface QuestionOption {
  label: string
  value: number | string
  description?: string
}

export interface Question {
  id: keyof WizardAnswers
  title: string
  subtitle: string
  options: QuestionOption[]
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
