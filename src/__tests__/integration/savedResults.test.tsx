/**
 * Integration tests for the saved results feature.
 * Tests the full flow: complete survey → landing shows saved card → view/delete.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardProvider } from '../../context/WizardContext'
import App from '../../App'
import { QUESTIONS } from '../../lib/constants'
import { STORAGE_KEY } from '../../lib/storage'

function renderApp(initialView: 'landing' | 'wizard' = 'wizard') {
  return render(
    <WizardProvider initialView={initialView}>
      <App />
    </WizardProvider>
  )
}

function getDialog() {
  return screen.getByRole('dialog')
}

async function completeWizard(user: ReturnType<typeof userEvent.setup>) {
  const dialog = getDialog()
  for (let i = 0; i < QUESTIONS.length; i++) {
    await within(dialog).findByText(QUESTIONS[i].title)
    if (QUESTIONS[i].options.length === 0 && QUESTIONS[i].customInput?.type === 'zip') {
      const input = within(dialog).getByLabelText(/zip code/i)
      await user.type(input, '90210')
      const submitBtn = within(dialog).getByRole('button', { name: /continue/i })
      await user.click(submitBtn)
    } else {
      const buttons = within(dialog).getAllByRole('button').filter(b => !b.getAttribute('aria-label'))
      await user.click(buttons[0])
    }
  }
  // Wait for results to appear
  await screen.findByText('Your Results')
}

beforeEach(() => {
  localStorage.clear()
})

describe('Saved results — full flow', () => {
  it('shows "Previous Analyses" on landing after completing the wizard', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    // Navigate back to landing
    const homeButton = screen.getAllByText('HomeWise')[0]
    await user.click(homeButton)

    // Should see Previous Analyses section
    expect(await screen.findByText('Previous Analyses')).toBeInTheDocument()
  })

  it('shows a saved result card with the View Results button', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    // Navigate to landing
    const homeButton = screen.getAllByText('HomeWise')[0]
    await user.click(homeButton)
    await screen.findByText('Previous Analyses')

    // Should see a View Results button
    expect(screen.getByRole('button', { name: /view results/i })).toBeInTheDocument()
  })

  it('clicking View Results loads the saved analysis', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    // Navigate to landing
    const homeButton = screen.getAllByText('HomeWise')[0]
    await user.click(homeButton)
    await screen.findByText('Previous Analyses')

    // Click View Results
    await user.click(screen.getByRole('button', { name: /view results/i }))

    // Should see results page again
    expect(await screen.findByText('Your Results')).toBeInTheDocument()
  })

  it('deleting a saved result removes its card', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    // Navigate to landing
    const homeButton = screen.getAllByText('HomeWise')[0]
    await user.click(homeButton)
    await screen.findByText('Previous Analyses')

    // Click the delete button (×)
    const deleteBtn = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteBtn)

    // Previous Analyses section should disappear (no saved results)
    expect(screen.queryByText('Previous Analyses')).not.toBeInTheDocument()
  })

  it('Clear All removes all saved results', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    // Navigate to landing
    const homeButton = screen.getAllByText('HomeWise')[0]
    await user.click(homeButton)
    await screen.findByText('Previous Analyses')

    // Click Clear All
    await user.click(screen.getByRole('button', { name: /clear all/i }))

    // Previous Analyses section should disappear
    expect(screen.queryByText('Previous Analyses')).not.toBeInTheDocument()
  })
})

describe('Saved results — landing page without history', () => {
  it('does not show Previous Analyses section when no results are saved', () => {
    renderApp('landing')
    expect(screen.queryByText('Previous Analyses')).not.toBeInTheDocument()
  })
})

describe('Saved results — persistence', () => {
  it('saves to localStorage when wizard is completed', async () => {
    const user = userEvent.setup()
    renderApp('wizard')
    await completeWizard(user)

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toHaveProperty('id')
    expect(parsed[0]).toHaveProperty('label')
  })
})
