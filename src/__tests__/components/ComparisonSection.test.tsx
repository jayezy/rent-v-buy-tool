/**
 * Tests for ComparisonSection swipeable carousel.
 * Verifies indicator pills, content switching, keyboard navigation, and accessibility.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ComparisonSection from '../../components/landing/ComparisonSection'

const CATEGORY_LABELS = [
  'Monthly Costs',
  'Upfront Costs',
  'Maintenance',
  'Wealth Building',
  'Flexibility',
  'Tax Benefits',
  'Customization',
  'Market Risk',
]

function renderComparison() {
  return render(<ComparisonSection />)
}

describe('ComparisonSection — indicator pills', () => {
  it('renders the section heading', () => {
    renderComparison()
    expect(screen.getByText(/renting vs\. buying/i)).toBeInTheDocument()
  })

  it('renders a tablist', () => {
    renderComparison()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders all 8 category indicators', () => {
    renderComparison()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(8)
  })

  it('renders indicators with correct labels', () => {
    renderComparison()
    for (const label of CATEGORY_LABELS) {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument()
    }
  })

  it('first category is selected by default', () => {
    renderComparison()
    const firstTab = screen.getByRole('tab', { name: 'Monthly Costs' })
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
  })

  it('non-active indicators have aria-selected false', () => {
    renderComparison()
    const secondTab = screen.getByRole('tab', { name: 'Upfront Costs' })
    expect(secondTab).toHaveAttribute('aria-selected', 'false')
  })
})

describe('ComparisonSection — content display', () => {
  it('renders a tabpanel', () => {
    renderComparison()
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  it('shows renting and buying perspectives', () => {
    renderComparison()
    expect(screen.getByText('Renting')).toBeInTheDocument()
    expect(screen.getByText('Buying')).toBeInTheDocument()
  })

  it('shows content for the default active category', () => {
    renderComparison()
    expect(screen.getByText('Predictable payments')).toBeInTheDocument()
  })
})

describe('ComparisonSection — click navigation', () => {
  it('clicking a different indicator changes the selected state', async () => {
    const user = userEvent.setup()
    renderComparison()

    const maintenanceTab = screen.getByRole('tab', { name: 'Maintenance' })
    expect(maintenanceTab).toHaveAttribute('aria-selected', 'false')

    await user.click(maintenanceTab)
    expect(maintenanceTab).toHaveAttribute('aria-selected', 'true')

    // The first tab should no longer be selected
    const firstTab = screen.getByRole('tab', { name: 'Monthly Costs' })
    expect(firstTab).toHaveAttribute('aria-selected', 'false')
  })

  it('clicking an indicator updates the content', async () => {
    const user = userEvent.setup()
    renderComparison()

    await user.click(screen.getByRole('tab', { name: 'Flexibility' }))
    expect(screen.getByText('Easy to relocate')).toBeInTheDocument()
  })

  it('clicking the last indicator works correctly', async () => {
    const user = userEvent.setup()
    renderComparison()

    const lastTab = screen.getByRole('tab', { name: 'Market Risk' })
    await user.click(lastTab)
    expect(lastTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Shielded from price drops')).toBeInTheDocument()
  })
})

describe('ComparisonSection — keyboard navigation', () => {
  it('ArrowRight advances to the next category', async () => {
    const user = userEvent.setup()
    renderComparison()

    const firstTab = screen.getByRole('tab', { name: 'Monthly Costs' })
    firstTab.focus()

    await user.keyboard('{ArrowRight}')
    const secondTab = screen.getByRole('tab', { name: 'Upfront Costs' })
    expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })

  it('ArrowLeft goes to the previous category', async () => {
    const user = userEvent.setup()
    renderComparison()

    // Navigate to Maintenance (index 2) first
    await user.click(screen.getByRole('tab', { name: 'Maintenance' }))

    screen.getByRole('tab', { name: 'Maintenance' }).focus()
    await user.keyboard('{ArrowLeft}')

    expect(screen.getByRole('tab', { name: 'Upfront Costs' }))
      .toHaveAttribute('aria-selected', 'true')
  })

  it('ArrowRight at the last category does not advance', async () => {
    const user = userEvent.setup()
    renderComparison()

    await user.click(screen.getByRole('tab', { name: 'Market Risk' }))
    screen.getByRole('tab', { name: 'Market Risk' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Market Risk' }))
      .toHaveAttribute('aria-selected', 'true')
  })

  it('ArrowLeft at the first category does not retreat', async () => {
    const user = userEvent.setup()
    renderComparison()

    screen.getByRole('tab', { name: 'Monthly Costs' }).focus()
    await user.keyboard('{ArrowLeft}')

    expect(screen.getByRole('tab', { name: 'Monthly Costs' }))
      .toHaveAttribute('aria-selected', 'true')
  })
})
