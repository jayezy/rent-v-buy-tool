import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from '../../components/ui/ProgressBar'
import { QUESTIONS } from '../../lib/constants'

describe('ProgressBar', () => {
  it('shows the correct step count for step 0', () => {
    render(<ProgressBar currentStep={0} />)
    expect(screen.getByText(`Question 1 of ${QUESTIONS.length}`)).toBeInTheDocument()
  })

  it('shows the correct step count for step 5', () => {
    render(<ProgressBar currentStep={5} />)
    expect(screen.getByText(`Question 6 of ${QUESTIONS.length}`)).toBeInTheDocument()
  })

  it('shows the correct step count for the last step', () => {
    const last = QUESTIONS.length - 1
    render(<ProgressBar currentStep={last} />)
    expect(screen.getByText(`Question ${QUESTIONS.length} of ${QUESTIONS.length}`)).toBeInTheDocument()
  })

  it('shows 10% progress on step 0', () => {
    render(<ProgressBar currentStep={0} />)
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('shows 100% progress on the last step', () => {
    render(<ProgressBar currentStep={QUESTIONS.length - 1} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('progress bar fill width increases with step', () => {
    const { container: c1 } = render(<ProgressBar currentStep={2} />)
    const { container: c2 } = render(<ProgressBar currentStep={7} />)

    const bar1 = c1.querySelector('[style*="width"]') as HTMLElement
    const bar2 = c2.querySelector('[style*="width"]') as HTMLElement

    const pct1 = parseFloat(bar1.style.width)
    const pct2 = parseFloat(bar2.style.width)
    expect(pct2).toBeGreaterThan(pct1)
  })
})
