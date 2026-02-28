/**
 * Integration tests for the landing page → wizard flow,
 * and for the custom value input within the wizard.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardProvider } from '../../context/WizardContext'
import App from '../../App'
import { QUESTIONS } from '../../lib/constants'

function renderFromLanding() {
  return render(
    <WizardProvider initialView="landing">
      <App />
    </WizardProvider>
  )
}

describe('Landing → Wizard navigation', () => {
  it('starts on the landing page by default', () => {
    renderFromLanding()
    expect(screen.getByText('HomeWise')).toBeInTheDocument()
  })

  it('clicking "Take the Free Survey" navigates to question 1', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    expect(await screen.findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('landing page is no longer visible after navigating to wizard', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    await screen.findByText(QUESTIONS[0].title)
    expect(screen.queryByText('HomeWise')).not.toBeInTheDocument()
  })
})

describe('Wizard — custom value input integration', () => {
  async function navigateToWizard(user: ReturnType<typeof userEvent.setup>) {
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    await screen.findByText(QUESTIONS[0].title)
  }

  it('first question shows a custom value input', async () => {
    const user = userEvent.setup()
    await navigateToWizard(user)
    // Question 0 (income) has customInput defined
    expect(screen.getByRole('button', { name: /use this/i })).toBeInTheDocument()
  })

  it('entering a custom value in the input and submitting advances to step 2', async () => {
    const user = userEvent.setup()
    await navigateToWizard(user)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '95000')
    await user.click(screen.getByRole('button', { name: /use this/i }))
    expect(await screen.findByText('Question 2 of 10')).toBeInTheDocument()
  })

  it('pressing Enter in the custom input also advances to next step', async () => {
    const user = userEvent.setup()
    await navigateToWizard(user)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '120000')
    await user.keyboard('{Enter}')
    expect(await screen.findByText('Question 2 of 10')).toBeInTheDocument()
  })

  it('invalid custom value does not advance the wizard', async () => {
    const user = userEvent.setup()
    await navigateToWizard(user)
    // Don't type anything — just try to submit via Enter (input is empty)
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    await user.keyboard('{Enter}')
    // Still on question 1
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument()
  })
})

describe('Results — assumptions editor integration', () => {
  async function completeWizardFromLanding(user: ReturnType<typeof userEvent.setup>) {
    renderFromLanding()
    // Navigate to wizard
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    // Complete all 10 questions by clicking the first option each time
    for (let i = 0; i < QUESTIONS.length; i++) {
      await screen.findByText(QUESTIONS[i].title)
      const buttons = screen.getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
      await user.click(buttons[0])
    }
    await screen.findByText('Your Results')
  }

  it('results page shows the AssumptionsEditor', async () => {
    const user = userEvent.setup()
    await completeWizardFromLanding(user)
    expect(screen.getByText(/Assumptions & Rates/i)).toBeInTheDocument()
  })

  it('changing a slider updates the displayed rate value', async () => {
    const user = userEvent.setup()
    await completeWizardFromLanding(user)
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.08' } })
    expect(screen.getByText('8.00%')).toBeInTheDocument()
  })

  it('changing a slider shows "Customized" badge', async () => {
    const user = userEvent.setup()
    await completeWizardFromLanding(user)
    const slider = screen.getByLabelText('Mortgage rate')
    fireEvent.change(slider, { target: { value: '0.07' } })
    expect(screen.getByText('Customized')).toBeInTheDocument()
  })
})
