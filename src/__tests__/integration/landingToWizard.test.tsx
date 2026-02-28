/**
 * Integration tests for the landing page → wizard modal flow,
 * close button behavior, and custom value input within the wizard modal.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
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

  it('clicking "Take the Free Survey" opens the wizard modal', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    const dialog = screen.getByRole('dialog')
    expect(await within(dialog).findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('landing page stays in the DOM behind the wizard modal', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    await screen.findByRole('dialog')
    // HomeWise is still present (landing page behind modal)
    expect(screen.getByText('HomeWise')).toBeInTheDocument()
  })

  it('wizard modal has a close button', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    await screen.findByRole('dialog')
    expect(screen.getByLabelText('Close survey')).toBeInTheDocument()
  })

  it('clicking the close button dismisses the wizard modal', async () => {
    const user = userEvent.setup()
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    await screen.findByRole('dialog')
    await user.click(screen.getByLabelText('Close survey'))
    // Dialog should be gone
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    // Landing page still visible
    expect(screen.getByText('HomeWise')).toBeInTheDocument()
  })

  it('re-opening the survey resumes where the user left off', async () => {
    const user = userEvent.setup()
    renderFromLanding()

    // Open survey and answer first question
    await user.click(screen.getAllByRole('button', { name: /take the free survey/i })[0])
    const dialog = await screen.findByRole('dialog')
    const buttons = within(dialog).getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
    await user.click(buttons[0])
    await within(dialog).findByText('Question 2 of 10')

    // Close the modal
    await user.click(screen.getByLabelText('Close survey'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Re-open — should be at question 2
    await user.click(screen.getAllByRole('button', { name: /take the free survey/i })[0])
    const dialog2 = await screen.findByRole('dialog')
    expect(within(dialog2).getByText('Question 2 of 10')).toBeInTheDocument()
  })
})

describe('Wizard modal — custom value input integration', () => {
  async function openWizard(user: ReturnType<typeof userEvent.setup>) {
    renderFromLanding()
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    const dialog = await screen.findByRole('dialog')
    await within(dialog).findByText(QUESTIONS[0].title)
    return dialog
  }

  it('first question shows a custom value input', async () => {
    const user = userEvent.setup()
    const dialog = await openWizard(user)
    expect(within(dialog).getByRole('button', { name: /use this/i })).toBeInTheDocument()
  })

  it('entering a custom value and submitting advances to step 2', async () => {
    const user = userEvent.setup()
    const dialog = await openWizard(user)
    const input = within(dialog).getByRole('spinbutton')
    await user.type(input, '95000')
    await user.click(within(dialog).getByRole('button', { name: /use this/i }))
    expect(await within(dialog).findByText('Question 2 of 10')).toBeInTheDocument()
  })

  it('pressing Enter in the custom input also advances to next step', async () => {
    const user = userEvent.setup()
    const dialog = await openWizard(user)
    const input = within(dialog).getByRole('spinbutton')
    await user.type(input, '120000')
    await user.keyboard('{Enter}')
    expect(await within(dialog).findByText('Question 2 of 10')).toBeInTheDocument()
  })

  it('invalid custom value does not advance the wizard', async () => {
    const user = userEvent.setup()
    const dialog = await openWizard(user)
    const input = within(dialog).getByRole('spinbutton')
    await user.click(input)
    await user.keyboard('{Enter}')
    // Still on question 1
    expect(within(dialog).getByText('Question 1 of 10')).toBeInTheDocument()
  })
})

describe('Results — assumptions editor integration', () => {
  async function completeWizardFromLanding(user: ReturnType<typeof userEvent.setup>) {
    renderFromLanding()
    // Open wizard
    const cta = screen.getAllByRole('button', { name: /take the free survey/i })[0]
    await user.click(cta)
    const dialog = await screen.findByRole('dialog')
    // Complete all 10 questions
    for (let i = 0; i < QUESTIONS.length; i++) {
      await within(dialog).findByText(QUESTIONS[i].title)
      const buttons = within(dialog).getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
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
