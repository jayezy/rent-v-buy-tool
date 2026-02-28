/**
 * Tests for AssumptionsEditor component.
 * Verifies that sliders render with correct defaults, that moving a slider
 * dispatches UPDATE_ASSUMPTIONS, and that the Reset button appears and works.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AssumptionsEditor from '../../components/results/AssumptionsEditor'
import { WizardProvider } from '../../context/WizardContext'
import { DEFAULTS } from '../../lib/constants'

function renderEditor() {
  return render(
    <WizardProvider initialView="results">
      <AssumptionsEditor />
    </WizardProvider>
  )
}

describe('AssumptionsEditor — rendering', () => {
  it('renders the collapsible summary heading', () => {
    renderEditor()
    expect(screen.getByText(/Assumptions & Rates/i)).toBeInTheDocument()
  })

  it('renders all 6 slider labels', () => {
    const { container } = renderEditor()
    // Open the details element
    const details = container.querySelector('details')!
    details.open = true
    // Re-render in an open state by checking for labels
    expect(screen.getByLabelText('Mortgage rate')).toBeInTheDocument()
    expect(screen.getByLabelText('Home appreciation / yr')).toBeInTheDocument()
    expect(screen.getByLabelText('Rent increase / yr')).toBeInTheDocument()
    expect(screen.getByLabelText('Maintenance (% of value)')).toBeInTheDocument()
    expect(screen.getByLabelText('Buying closing costs')).toBeInTheDocument()
    expect(screen.getByLabelText('Selling costs')).toBeInTheDocument()
  })

  it('mortgage rate slider defaults to 6.0% (DEFAULTS.mortgageRate)', () => {
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate') as HTMLInputElement
    expect(parseFloat(slider.value)).toBeCloseTo(DEFAULTS.mortgageRate, 4)
  })

  it('home appreciation slider defaults to DEFAULTS.homeAppreciation', () => {
    renderEditor()
    const slider = screen.getByLabelText('Home appreciation / yr') as HTMLInputElement
    expect(parseFloat(slider.value)).toBeCloseTo(DEFAULTS.homeAppreciation, 4)
  })

  it('does NOT show "Customized" badge by default', () => {
    renderEditor()
    expect(screen.queryByText('Customized')).not.toBeInTheDocument()
  })

  it('does NOT show "Reset to defaults" button by default', () => {
    renderEditor()
    expect(screen.queryByRole('button', { name: /reset to defaults/i })).not.toBeInTheDocument()
  })
})

describe('AssumptionsEditor — interaction', () => {
  it('shows "Customized" badge after changing a slider', () => {
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.07' } })
    expect(screen.getByText('Customized')).toBeInTheDocument()
  })

  it('shows "Reset to defaults" button after a change', () => {
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.08' } })
    expect(screen.getByRole('button', { name: /reset to defaults/i })).toBeInTheDocument()
  })

  it('mortgage rate display updates when slider moves', () => {
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.07' } })
    // 7.00% should be displayed somewhere
    expect(screen.getByText('7.00%')).toBeInTheDocument()
  })

  it('clicking "Reset to defaults" hides the Customized badge', async () => {
    const user = userEvent.setup()
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.09' } })
    expect(screen.getByText('Customized')).toBeInTheDocument()
    const resetBtn = screen.getByRole('button', { name: /reset to defaults/i })
    await user.click(resetBtn)
    expect(screen.queryByText('Customized')).not.toBeInTheDocument()
  })

  it('after reset, mortgage rate returns to default display', async () => {
    const user = userEvent.setup()
    renderEditor()
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.09' } })
    await user.click(screen.getByRole('button', { name: /reset to defaults/i }))
    // Default is 6.00%
    expect(screen.getByText('6.00%')).toBeInTheDocument()
  })
})
