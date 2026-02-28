import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BreakevenIndicator from '../../components/results/BreakevenIndicator'

describe('BreakevenIndicator — with a breakeven year', () => {
  it('shows the breakeven year', () => {
    render(<BreakevenIndicator breakevenYear={7} totalYears={10} />)
    expect(screen.getByText(/year 7/i)).toBeInTheDocument()
  })

  it('renders a progress bar element', () => {
    const { container } = render(<BreakevenIndicator breakevenYear={5} totalYears={10} />)
    const bar = container.querySelector('[style*="width"]')
    expect(bar).toBeInTheDocument()
  })

  it('progress bar is at 50% for breakeven at year 5 of 10', () => {
    const { container } = render(<BreakevenIndicator breakevenYear={5} totalYears={10} />)
    const bar = container.querySelector('[style*="width"]') as HTMLElement
    expect(bar.style.width).toBe('50%')
  })

  it('progress bar is at 100% for breakeven at last year', () => {
    const { container } = render(<BreakevenIndicator breakevenYear={10} totalYears={10} />)
    const bar = container.querySelector('[style*="width"]') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })
})

describe('BreakevenIndicator — no breakeven', () => {
  it('shows "No breakeven" message when breakevenYear is null', () => {
    render(<BreakevenIndicator breakevenYear={null} totalYears={10} />)
    expect(screen.getByText(/No breakeven within 10 years/i)).toBeInTheDocument()
  })

  it('does not render a progress bar when breakevenYear is null', () => {
    const { container } = render(<BreakevenIndicator breakevenYear={null} totalYears={10} />)
    const bar = container.querySelector('[style*="width"]')
    expect(bar).not.toBeInTheDocument()
  })
})
