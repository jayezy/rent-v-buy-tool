import type { WizardAnswers, YearProjection, ProjectionResult, AssumptionOverrides } from './types'
import { DEFAULTS } from './constants'
import { getLocationData } from './stateData'

function getMonthlyMortgagePayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 12
  const numPayments = termYears * 12
  if (monthlyRate === 0) return principal / numPayments
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
}

function getRemainingBalance(principal: number, annualRate: number, termYears: number, monthsPaid: number): number {
  const monthlyRate = annualRate / 12
  const numPayments = termYears * 12
  if (monthlyRate === 0) return principal * (1 - monthsPaid / numPayments)
  const monthlyPayment = getMonthlyMortgagePayment(principal, annualRate, termYears)
  return principal * Math.pow(1 + monthlyRate, monthsPaid) -
    monthlyPayment * ((Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate)
}

function getInterestPaidInYear(principal: number, annualRate: number, termYears: number, year: number): number {
  const monthlyRate = annualRate / 12
  const monthlyPayment = getMonthlyMortgagePayment(principal, annualRate, termYears)
  let balance = getRemainingBalance(principal, annualRate, termYears, (year - 1) * 12)
  let totalInterest = 0
  for (let m = 0; m < 12; m++) {
    const interestThisMonth = balance * monthlyRate
    totalInterest += interestThisMonth
    balance -= (monthlyPayment - interestThisMonth)
  }
  return totalInterest
}

function isMarried(household: string): boolean {
  return household === 'couple' || household === 'family' || household === 'planning'
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate year-by-year rent vs buy projections.
 * @param answers   The 10 wizard answers
 * @param overrides Optional overrides for key assumption rates (merged with DEFAULTS)
 */
export function calculateProjections(
  answers: WizardAnswers,
  overrides: Partial<AssumptionOverrides> = {},
): ProjectionResult {
  // Merge user overrides with built-in defaults
  const rates = { ...DEFAULTS, ...overrides }

  const location = getLocationData(answers.location)
  const effectiveDownPayment = Math.max(0, answers.downPayment - answers.bigExpenses)
  const loanAmount = Math.max(0, answers.homePrice - effectiveDownPayment)
  const closingCosts = answers.homePrice * rates.closingCostsBuy

  const monthlyMortgage = getMonthlyMortgagePayment(loanAmount, rates.mortgageRate, DEFAULTS.mortgageTerm)

  const married = isMarried(answers.household)
  const standardDeduction = married ? DEFAULTS.standardDeductionMarried : DEFAULTS.standardDeductionSingle

  const projections: YearProjection[] = []
  let cumulativeRentCost = 0
  let cumulativeBuyCost = 0
  let renterInvestmentBalance = effectiveDownPayment + closingCosts
  let breakevenYear: number | null = null
  let totalInterestPaid = 0

  for (let year = 1; year <= answers.yearsToStay; year++) {
    // --- RENT SCENARIO ---
    const monthlyRent = answers.monthlyBudget * Math.pow(1 + rates.rentAppreciation, year - 1)
    const annualRentCost = monthlyRent * 12
    cumulativeRentCost += annualRentCost

    // --- BUY SCENARIO ---
    const homeValue = answers.homePrice * Math.pow(1 + rates.homeAppreciation, year)
    const annualPropertyTax = homeValue * location.propertyTaxRate
    const annualInsurance = homeValue * location.insuranceRate
    const annualMaintenance = homeValue * rates.maintenance
    const annualMortgagePayments = monthlyMortgage * 12
    const interestThisYear = getInterestPaidInYear(loanAmount, rates.mortgageRate, DEFAULTS.mortgageTerm, year)
    totalInterestPaid += interestThisYear

    const itemizedDeductions = interestThisYear + annualPropertyTax
    const taxBenefit = itemizedDeductions > standardDeduction
      ? (itemizedDeductions - standardDeduction) * getMarginalRate(answers.annualIncome, married)
      : 0

    let annualBuyCost = annualMortgagePayments + annualPropertyTax + annualInsurance + annualMaintenance - taxBenefit
    if (year === 1) annualBuyCost += closingCosts
    cumulativeBuyCost += annualBuyCost

    // --- RENTER INVESTMENT ---
    const monthlyBuyCost = annualBuyCost / 12
    const monthlySavings = Math.max(0, monthlyBuyCost - monthlyRent)

    renterInvestmentBalance *= (1 + answers.investmentStyle)
    renterInvestmentBalance += monthlySavings * 12

    // --- EQUITY ---
    const remainingMortgage = getRemainingBalance(loanAmount, rates.mortgageRate, DEFAULTS.mortgageTerm, year * 12)
    const equityBuilt = homeValue - remainingMortgage
    const buyerNetWealth = equityBuilt - (homeValue * rates.sellingCosts)
    const renterNetWealth = renterInvestmentBalance

    if (breakevenYear === null && buyerNetWealth >= renterNetWealth) {
      breakevenYear = year
    }

    projections.push({
      year,
      monthlyRent: Math.round(monthlyRent),
      annualRentCost: Math.round(annualRentCost),
      cumulativeRentCost: Math.round(cumulativeRentCost),
      renterInvestmentBalance: Math.round(renterInvestmentBalance),
      renterNetWealth: Math.round(renterNetWealth),
      monthlyMortgage: Math.round(monthlyMortgage),
      annualBuyCost: Math.round(annualBuyCost),
      cumulativeBuyCost: Math.round(cumulativeBuyCost),
      homeValue: Math.round(homeValue),
      remainingMortgage: Math.round(remainingMortgage),
      equityBuilt: Math.round(equityBuilt),
      buyerNetWealth: Math.round(buyerNetWealth),
      monthlySavingsIfRenting: Math.round(monthlySavings),
      buyAdvantage: Math.round(buyerNetWealth - renterNetWealth),
    })
  }

  const last = projections[projections.length - 1]
  const wealthDifference = last.buyerNetWealth - last.renterNetWealth
  const recommendation = wealthDifference > 0 ? 'buy' : 'rent'

  const absDiff = formatCurrency(Math.abs(wealthDifference))
  const years = answers.yearsToStay

  let summary: string
  if (recommendation === 'buy') {
    if (breakevenYear && breakevenYear <= 3) {
      summary = `Buying is the clear winner. You'd build ${absDiff} more wealth over ${years} years, and it pays off in just ${breakevenYear} year${breakevenYear > 1 ? 's' : ''}.`
    } else if (breakevenYear) {
      summary = `Buying wins over ${years} years, building ${absDiff} more wealth — but it takes ${breakevenYear} years to break even vs. renting.`
    } else {
      summary = `Buying edges out renting over ${years} years, with ${absDiff} more in net wealth.`
    }
  } else {
    if (Math.abs(wealthDifference) > 100000) {
      summary = `Renting and investing saves you ${absDiff} over ${years} years. The math strongly favors renting in your situation.`
    } else {
      summary = `Renting and investing comes out ${absDiff} ahead over ${years} years. It's close — lifestyle factors may tip the balance.`
    }
  }

  return {
    projections,
    recommendation,
    breakevenYear,
    totalBuyCost: Math.round(cumulativeBuyCost),
    totalRentCost: Math.round(cumulativeRentCost),
    finalBuyerWealth: last.buyerNetWealth,
    finalRenterWealth: last.renterNetWealth,
    wealthDifference: Math.round(wealthDifference),
    monthlyMortgagePayment: Math.round(monthlyMortgage),
    totalInterestPaid: Math.round(totalInterestPaid),
    summary,
  }
}

function getMarginalRate(income: number, married: boolean): number {
  if (married) {
    if (income <= 23200) return 0.10
    if (income <= 94300) return 0.12
    if (income <= 201050) return 0.22
    if (income <= 383900) return 0.24
    if (income <= 487450) return 0.32
    if (income <= 731200) return 0.35
    return 0.37
  } else {
    if (income <= 11600) return 0.10
    if (income <= 47150) return 0.12
    if (income <= 100525) return 0.22
    if (income <= 191950) return 0.24
    if (income <= 243725) return 0.32
    if (income <= 609350) return 0.35
    return 0.37
  }
}
