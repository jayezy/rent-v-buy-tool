/**
 * Tests for InputsEditor component.
 * Verifies the collapsible "Your Inputs" panel on the results page:
 * - Renders summary heading with answer count badge
 * - Displays formatted answer values when expanded
 * - Clicking a row enters edit mode with option pills
 * - Only one row can be in edit mode at a time
 * - Zip code row shows text input in edit mode
 * - Selecting a new option dispatches UPDATE_ANSWER and updates display
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardProvider } from '../../context/WizardContext'
import App from '../../App'
import { QUESTIONS } from '../../lib/constants'

/** Render the full App in wizard view so we can complete the wizard and reach results. */
function renderApp() {
  return render(
    <WizardProvider initialView="wizard">
      <App />
    </WizardProvider>
  )
}

/**
 * Complete the wizard by selecting the first option on each question.
 * For the zip code question (no preset options), types "90210" and clicks Continue.
 */
async function completeWizard(user: ReturnType<typeof userEvent.setup>) {
  const dialog = screen.getByRole('dialog')
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
  await screen.findByText('Your Results')
}

/**
 * Open the InputsEditor details panel by clicking on its summary.
 * Returns the details element for scoped queries.
 */
async function openInputsEditor(user: ReturnType<typeof userEvent.setup>) {
  const summary = screen.getByText('Your Inputs')
  await user.click(summary)
  // The details element is the parent of the summary
  return summary.closest('details')!
}

beforeEach(() => {
  localStorage.clear()
})

describe('InputsEditor -- rendering', () => {
  it('renders "Your Inputs" summary heading after completing wizard', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    expect(screen.getByText('Your Inputs')).toBeInTheDocument()
  })

  it('shows answer count badge "10 answers"', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)
    expect(screen.getByText('10 answers')).toBeInTheDocument()
  })

  it('displays formatted answer values when expanded', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // The first question's first option is "Under $50K" (annualIncome)
    expect(within(details).getByText('Under $50K')).toBeInTheDocument()
    // The short label for the first question should also appear
    expect(within(details).getByText('Annual Income')).toBeInTheDocument()
  })

  it('displays all 10 short labels when expanded', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    const expectedLabels = [
      'Annual Income',
      'Monthly Budget',
      'Down Payment',
      'Home Price',
      'Investment Style',
      'Years to Stay',
      'Big Expenses',
      'Location',
      'Total Savings',
      'Household',
    ]
    for (const label of expectedLabels) {
      expect(within(details).getByText(label)).toBeInTheDocument()
    }
  })

  it('shows help text about clicking to edit', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    await openInputsEditor(user)
    expect(
      screen.getByText(/click any value to edit it/i)
    ).toBeInTheDocument()
  })
})

describe('InputsEditor -- edit mode', () => {
  it('clicking a row enters edit mode showing option pills', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Click the "Annual Income" row to enter edit mode
    const incomeRow = within(details).getByText('Annual Income').closest('button')!
    await user.click(incomeRow)

    // In edit mode, should see all option pills for annualIncome question
    // The first option was already selected ("Under $50K"), the other options should also show
    expect(within(details).getByText('$50K \u2013 $75K')).toBeInTheDocument()
    expect(within(details).getByText('$75K \u2013 $100K')).toBeInTheDocument()
    expect(within(details).getByText('$100K \u2013 $150K')).toBeInTheDocument()

    // Should also show a "Cancel" button in edit mode
    expect(within(details).getByText('Cancel')).toBeInTheDocument()
  })

  it('selecting a new option updates the displayed value', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Click the "Annual Income" row to enter edit mode
    const incomeRow = within(details).getByText('Annual Income').closest('button')!
    await user.click(incomeRow)

    // Select a different option: "$100K - $150K"
    const newOption = within(details).getByText('$100K \u2013 $150K')
    await user.click(newOption)

    // After selecting, edit mode should close and the new value should be displayed
    // The displayed value should now show "$100K - $150K"
    expect(within(details).getByText('$100K \u2013 $150K')).toBeInTheDocument()

    // The old "Under $50K" for income should no longer be displayed (since the value changed)
    expect(within(details).queryByText('Under $50K')).not.toBeInTheDocument()
  })

  it('only one row can be in edit mode at a time', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Click the "Annual Income" row to enter edit mode
    const incomeRow = within(details).getByText('Annual Income').closest('button')!
    await user.click(incomeRow)

    // Verify edit mode is showing for Annual Income (Cancel button present, option pills visible)
    expect(within(details).getByText('Cancel')).toBeInTheDocument()
    expect(within(details).getByText('$50K \u2013 $75K')).toBeInTheDocument()

    // Now click the "Monthly Budget" row. It's still a button since it's not in edit mode.
    const budgetRow = within(details).getByText('Monthly Budget').closest('button')!
    await user.click(budgetRow)

    // Monthly Budget edit should now be open — its option pills should be visible
    expect(within(details).getByText('Under $1,500')).toBeInTheDocument()

    // Annual Income's edit mode should be closed — its unique option pills should no longer appear
    // "$50K - $75K" is unique to annualIncome, so it should no longer be in the DOM
    expect(within(details).queryByText('$50K \u2013 $75K')).not.toBeInTheDocument()
  })

  it('Cancel button closes edit mode', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Click the "Annual Income" row to enter edit mode
    const incomeRow = within(details).getByText('Annual Income').closest('button')!
    await user.click(incomeRow)

    // Verify edit mode is open
    expect(within(details).getByText('Cancel')).toBeInTheDocument()

    // Click Cancel
    await user.click(within(details).getByText('Cancel'))

    // Edit mode should close — Cancel button should be gone
    expect(within(details).queryByText('Cancel')).not.toBeInTheDocument()

    // The original value should still be displayed
    expect(within(details).getByText('Under $50K')).toBeInTheDocument()
  })
})

describe('InputsEditor -- zip code editing', () => {
  it('zip code row shows text input in edit mode', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Click the "Location" row to enter edit mode
    const locationRow = within(details).getByText('Location').closest('button')!
    await user.click(locationRow)

    // Should show a text input for zip code editing
    const zipInput = within(details).getByLabelText(/edit zip code/i)
    expect(zipInput).toBeInTheDocument()
    expect(zipInput).toHaveAttribute('type', 'text')

    // Should also show an "Update" button
    expect(within(details).getByText('Update')).toBeInTheDocument()
  })

  it('zip code input shows error for unrecognized zip code', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Enter edit mode for Location
    const locationRow = within(details).getByText('Location').closest('button')!
    await user.click(locationRow)

    const zipInput = within(details).getByLabelText(/edit zip code/i)
    // Type a 5-digit code that is not a recognized US zip
    await user.type(zipInput, '00000')

    // Click Update with an invalid zip
    await user.click(within(details).getByText('Update'))

    // Should show validation error for unrecognized zip
    expect(within(details).getByRole('alert')).toHaveTextContent(/not a recognized/i)
  })

  it('Update button is disabled when fewer than 5 digits are entered', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Enter edit mode for Location
    const locationRow = within(details).getByText('Location').closest('button')!
    await user.click(locationRow)

    const zipInput = within(details).getByLabelText(/edit zip code/i)
    await user.type(zipInput, '123')

    // Update button should be disabled with fewer than 5 digits
    const updateBtn = within(details).getByText('Update')
    expect(updateBtn).toBeDisabled()
  })

  it('valid zip code updates the location and exits edit mode', async () => {
    const user = userEvent.setup()
    renderApp()
    await completeWizard(user)

    const details = await openInputsEditor(user)

    // Enter edit mode for Location
    const locationRow = within(details).getByText('Location').closest('button')!
    await user.click(locationRow)

    const zipInput = within(details).getByLabelText(/edit zip code/i)
    await user.type(zipInput, '10001')

    // Click Update
    await user.click(within(details).getByText('Update'))

    // Should exit edit mode and show the new zip code with state name
    // 10001 is a New York zip code
    expect(within(details).getByText(/10001/)).toBeInTheDocument()
  })
})
