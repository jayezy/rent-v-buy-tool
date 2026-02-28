/**
 * Tests for the WizardModal overlay component.
 * Verifies dialog role, close button, question rendering, and progress bar.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardProvider } from '../../context/WizardContext'
import WizardModal from '../../components/wizard/WizardModal'
import App from '../../App'
import { QUESTIONS } from '../../lib/constants'

function renderModal() {
  return render(
    <WizardProvider initialView="wizard">
      <WizardModal />
    </WizardProvider>
  )
}

describe('WizardModal — rendering', () => {
  it('renders with dialog role', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('renders the first question', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('renders a close button', () => {
    renderModal()
    expect(screen.getByLabelText('Close survey')).toBeInTheDocument()
  })

  it('renders progress bar showing question 1 of 10', () => {
    renderModal()
    expect(within(screen.getByRole('dialog')).getByText('Question 1 of 10')).toBeInTheDocument()
  })

  it('does not show back button on first step', () => {
    renderModal()
    expect(within(screen.getByRole('dialog')).queryByLabelText('Go back')).not.toBeInTheDocument()
  })
})

describe('WizardModal — close behavior', () => {
  it('clicking close button returns to landing view', async () => {
    const user = userEvent.setup()
    render(
      <WizardProvider initialView="wizard">
        <App />
      </WizardProvider>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Close survey'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
