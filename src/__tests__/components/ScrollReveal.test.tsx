/**
 * Tests for ScrollReveal component.
 * The component uses Motion's useInView hook which is mocked via Vite alias
 * to return true by default, so elements appear right away in tests.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollReveal from '../../components/ui/ScrollReveal'

// Import the mock control function
import { __setInViewDefault } from 'motion/react'

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(<ScrollReveal><p>Hello</p></ScrollReveal>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('becomes visible immediately in tests (useInView mock returns true)', () => {
    const { container } = render(<ScrollReveal><p>Hi</p></ScrollReveal>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.opacity).toBe('1')
  })

  it('applies a custom className', () => {
    const { container } = render(
      <ScrollReveal className="my-custom"><p>Content</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-custom')
  })

  it('applies transition delay from delay prop in style', () => {
    const { container } = render(
      <ScrollReveal delay={300}><p>Delayed</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toContain('300ms')
  })

  it('defaults to 0ms delay', () => {
    const { container } = render(
      <ScrollReveal><p>No delay</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toContain('0ms')
  })

  it('has transition in style', () => {
    const { container } = render(
      <ScrollReveal><p>Smooth</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toContain('0.7s')
  })
})

describe('ScrollReveal — hidden state (useInView returns false)', () => {
  beforeEach(() => {
    // Override the mock to return false (simulating "not in view")
    __setInViewDefault(false)
  })

  afterEach(() => {
    // Restore default (true = visible)
    __setInViewDefault(true)
  })

  it('starts with opacity 0 when not in view', () => {
    const { container } = render(<ScrollReveal><p>Hidden</p></ScrollReveal>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.opacity).toBe('0')
  })
})
