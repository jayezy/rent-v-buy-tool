/**
 * Tests for LandingPage component.
 * Verifies the hero content, CTA buttons, comparison section, and navigation.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LandingPage from '../../components/landing/LandingPage'
import { WizardProvider } from '../../context/WizardContext'

function renderLanding() {
  return render(
    <WizardProvider initialView="landing">
      <LandingPage />
    </WizardProvider>
  )
}

describe('LandingPage — hero section', () => {
  it('renders the main heading', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('heading contains "rent or buy" text', () => {
    renderLanding()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toMatch(/rent or buy/i)
  })

  it('renders the primary CTA button', () => {
    renderLanding()
    expect(screen.getByRole('button', { name: /run your numbers/i })).toBeInTheDocument()
  })

  it('renders the nav Try Calculator link', () => {
    renderLanding()
    expect(screen.getByRole('button', { name: /try calculator/i })).toBeInTheDocument()
  })

  it('renders the brand name', () => {
    renderLanding()
    expect(screen.getByText('HomeWise')).toBeInTheDocument()
  })
})

describe('LandingPage — comparison section', () => {
  it('renders the renter vs buyer comparison section', () => {
    renderLanding()
    expect(screen.getByText(/renting vs\. buying/i)).toBeInTheDocument()
  })

  it('renders comparison tabs', () => {
    renderLanding()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})

describe('LandingPage — navigation', () => {
  it('clicking CTA button navigates to wizard (shows first question)', async () => {
    const user = userEvent.setup()
    const { default: App } = await import('../../App')
    render(
      <WizardProvider initialView="landing">
        <App />
      </WizardProvider>
    )
    const ctaButton = screen.getByRole('button', { name: /run your numbers/i })
    await user.click(ctaButton)
    const { QUESTIONS } = await import('../../lib/constants')
    expect(await screen.findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('clicking nav Try Calculator link also navigates to wizard', async () => {
    const user = userEvent.setup()
    const { default: App } = await import('../../App')
    render(
      <WizardProvider initialView="landing">
        <App />
      </WizardProvider>
    )
    const navLink = screen.getByRole('button', { name: /try calculator/i })
    await user.click(navLink)
    const { QUESTIONS } = await import('../../lib/constants')
    expect(await screen.findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })
})
