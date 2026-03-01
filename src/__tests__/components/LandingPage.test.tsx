/**
 * Tests for LandingPage component.
 * Verifies the hero content, stat cards, CTA buttons, and navigation dispatch.
 */
import { describe, it, expect, vi } from 'vitest'
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

  it('heading contains "rent vs. buy" text', () => {
    renderLanding()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toMatch(/rent vs\.? buy/i)
  })

  it('renders the primary CTA button', () => {
    renderLanding()
    const buttons = screen.getAllByRole('button', { name: /start analysis/i })
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the nav Get Started link', () => {
    renderLanding()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders the brand name', () => {
    renderLanding()
    expect(screen.getByText('HomeWise')).toBeInTheDocument()
  })
})

describe('LandingPage — stat cards', () => {
  it('shows current mortgage rate stat', () => {
    renderLanding()
    expect(screen.getByText('6.0%')).toBeInTheDocument()
  })

  it('shows high-yield savings stat', () => {
    renderLanding()
    expect(screen.getByText('4.0%')).toBeInTheDocument()
  })

  it('shows home appreciation stat', () => {
    renderLanding()
    expect(screen.getByText('2.0%')).toBeInTheDocument()
  })

  it('shows the mortgage rate label', () => {
    renderLanding()
    expect(screen.getByText('Current Mortgage Rate')).toBeInTheDocument()
  })
})

describe('LandingPage — feature strip', () => {
  it('shows Amortization & Tax Math feature', () => {
    renderLanding()
    expect(screen.getByText('Amortization & Tax Math')).toBeInTheDocument()
  })

  it('shows Wealth Trajectory Modeling feature', () => {
    renderLanding()
    expect(screen.getByText('Wealth Trajectory Modeling')).toBeInTheDocument()
  })

  it('shows Sensitivity Analysis feature', () => {
    renderLanding()
    expect(screen.getByText('Sensitivity Analysis')).toBeInTheDocument()
  })
})

describe('LandingPage — navigation', () => {
  it('clicking CTA button navigates to wizard (shows first question)', async () => {
    const user = userEvent.setup()
    // We need to render App so view switching works
    const { default: App } = await import('../../App')
    render(
      <WizardProvider initialView="landing">
        <App />
      </WizardProvider>
    )
    const ctaButton = screen.getAllByRole('button', { name: /start analysis/i })[0]
    await user.click(ctaButton)
    // After navigation, the wizard's first question should appear
    const { QUESTIONS } = await import('../../lib/constants')
    expect(await screen.findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })

  it('clicking nav survey link also navigates to wizard', async () => {
    const user = userEvent.setup()
    const { default: App } = await import('../../App')
    render(
      <WizardProvider initialView="landing">
        <App />
      </WizardProvider>
    )
    const navLink = screen.getByRole('button', { name: /get started/i })
    await user.click(navLink)
    const { QUESTIONS } = await import('../../lib/constants')
    expect(await screen.findByText(QUESTIONS[0].title)).toBeInTheDocument()
  })
})
