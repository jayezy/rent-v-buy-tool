/**
 * Tests for ScrollReveal component.
 * The global IntersectionObserver mock in test/setup.ts immediately triggers
 * visibility, so elements appear right away in tests.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollReveal from '../../components/ui/ScrollReveal'

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(<ScrollReveal><p>Hello</p></ScrollReveal>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('becomes visible immediately in tests (global IO mock)', () => {
    const { container } = render(<ScrollReveal><p>Hi</p></ScrollReveal>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('opacity-100')
  })

  it('applies a custom className', () => {
    const { container } = render(
      <ScrollReveal className="my-custom"><p>Content</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-custom')
  })

  it('applies transition-delay from delay prop', () => {
    const { container } = render(
      <ScrollReveal delay={300}><p>Delayed</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transitionDelay).toBe('300ms')
  })

  it('defaults to 0ms delay', () => {
    const { container } = render(
      <ScrollReveal><p>No delay</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transitionDelay).toBe('0ms')
  })

  it('has transition duration class', () => {
    const { container } = render(
      <ScrollReveal><p>Smooth</p></ScrollReveal>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('duration-700')
  })
})

describe('ScrollReveal — with custom IO mock (hidden initially)', () => {
  let savedIO: typeof IntersectionObserver

  beforeEach(() => {
    // Override the global mock with one that does NOT auto-trigger
    savedIO = global.IntersectionObserver
    global.IntersectionObserver = class NoOpObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords(): IntersectionObserverEntry[] { return [] }
      root = null
      rootMargin = ''
      thresholds = [] as number[]
    } as unknown as typeof IntersectionObserver
  })

  // Restore after
  afterEach(() => {
    global.IntersectionObserver = savedIO
  })

  it('starts with opacity-0 when observer has not fired', () => {
    const { container } = render(<ScrollReveal><p>Hidden</p></ScrollReveal>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('opacity-0')
  })
})
