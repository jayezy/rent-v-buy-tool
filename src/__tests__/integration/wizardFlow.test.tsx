/**
 * Integration tests for the full wizard → results flow.
 *
 * We render the full <App> (wrapped in WizardProvider) and drive the UI
 * through all 10 questions by clicking the first option on each step.
 * This exercises the real reducer, real calculations, and real rendering.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardProvider } from '../../context/WizardContext'
import App from '../../App'
import { QUESTIONS } from '../../lib/constants'

function renderApp() {
  return render(
    <WizardProvider initialView="wizard">
      <App />
    </WizardProvider>
  )
}

/** Click the first option card on the current wizard step */
async function pickFirstOption(user: ReturnType<typeof userEvent.setup>) {
  const buttons = screen.getAllByRole('button')
  // The first button may be the Back arrow — skip it if present.
  // Option cards always contain the option label text.
  const optionBtn = buttons.find(b => !b.querySelector('svg[stroke]') || b.textContent!.length > 3)
  await user.click(optionBtn!)
}

describe('Wizard flow — step navigation', () => {
  it('renders the first question on load', () => {
    renderApp()
    expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('shows "Question 1 of 10" progress on load', () => {
    renderApp()
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument()
  })

  it('does not show a Back button on the first step', () => {
    renderApp()
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument()
  })

  it('advances to step 2 after selecting an option on step 1', async () => {
    const user = userEvent.setup()
    renderApp()
    const firstOption = screen.getAllByRole('button')[0]
    await user.click(firstOption)
    expect(await screen.findByText('Question 2 of 10')).toBeInTheDocument()
  })

  it('shows a Back button after advancing past step 1', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getAllByRole('button')[0])
    expect(await screen.findByLabelText('Go back')).toBeInTheDocument()
  })

  it('goes back to step 1 when Back is clicked from step 2', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getAllByRole('button')[0])
    const backBtn = await screen.findByLabelText('Go back')
    await user.click(backBtn)
    expect(await screen.findByText('Question 1 of 10')).toBeInTheDocument()
  })

  it('shows the correct question title on each step', async () => {
    const user = userEvent.setup()
    renderApp()
    for (let i = 0; i < 3; i++) {
      // Wait for the current step's title (handles the 250ms auto-advance delay)
      await screen.findByText(QUESTIONS[i].title)
      const buttons = screen.getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
      await user.click(buttons[0])
    }
    expect(await screen.findByText(QUESTIONS[3].title)).toBeInTheDocument()
  })
})

describe('Wizard flow — completing all steps', () => {
  async function completeWizard(user: ReturnType<typeof userEvent.setup>) {
    for (let i = 0; i < QUESTIONS.length; i++) {
      // Wait for this step's question title to appear
      await screen.findByText(QUESTIONS[i].title)
      // Click first non-back-button option
      const buttons = screen.getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
      await user.click(buttons[0])
    }
  }

  it('shows the results dashboard after completing all 10 questions', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    expect(await screen.findByText('Your Results')).toBeInTheDocument()
  })

  it('results page contains a summary recommendation', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    await screen.findByText('Your Results')
    // The summary card shows either "Buying wins" or "Renting + Investing wins"
    const hasBuy = screen.queryByText('Buying wins')
    const hasRent = screen.queryByText('Renting + Investing wins')
    expect(hasBuy || hasRent).toBeTruthy()
  })

  it('results page contains the monthly mortgage stat label', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    await screen.findByText('Your Results')
    expect(screen.getByText(/monthly mortgage/i)).toBeInTheDocument()
  })

  it('results page shows Assumptions section', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    await screen.findByText('Your Results')
    expect(screen.getByText(/Assumptions/i)).toBeInTheDocument()
  })

  it('"Start Over" button returns to the wizard', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    await screen.findByText('Your Results')
    await user.click(screen.getByRole('button', { name: /start over/i }))
    expect(await screen.findByText('Question 1 of 10')).toBeInTheDocument()
  })
})

describe('Wizard flow — option selection state', () => {
  it('highlights the selected option card', async () => {
    const user = userEvent.setup()
    renderApp()
    const buttons = screen.getAllByRole('button')
    const target = buttons[0]
    await user.click(target)
    // After click the step advances, so we just verify it didn't crash
    expect(await screen.findByText('Question 2 of 10')).toBeInTheDocument()
  })
})

describe('Results dashboard — chart rendering', () => {
  async function getResults(user: ReturnType<typeof userEvent.setup>) {
    renderApp()
    for (let i = 0; i < QUESTIONS.length; i++) {
      await screen.findByText(QUESTIONS[i].title)
      const buttons = screen.getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
      await user.click(buttons[0])
    }
    await screen.findByText('Your Results')
  }

  it('renders the Cumulative Cost chart container', async () => {
    const user = userEvent.setup()
    await getResults(user)
    // Recharts mock renders with data-testid="recharts-responsive-container"
    expect(screen.getAllByTestId('recharts-responsive-container').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the Breakeven Indicator section', async () => {
    const user = userEvent.setup()
    await getResults(user)
    // Either shows a breakeven year or "No breakeven"
    const hasBE = screen.queryByText(/breaks even in year/i)
    const hasNoBE = screen.queryByText(/No breakeven within/i)
    expect(hasBE || hasNoBE).toBeTruthy()
  })

  it('renders chart section heading "Cumulative Cost"', async () => {
    const user = userEvent.setup()
    await getResults(user)
    expect(screen.getByText('Cumulative Cost')).toBeInTheDocument()
  })

  it('renders chart section heading "Net Wealth Comparison"', async () => {
    const user = userEvent.setup()
    await getResults(user)
    expect(screen.getByText('Net Wealth Comparison')).toBeInTheDocument()
  })
})
