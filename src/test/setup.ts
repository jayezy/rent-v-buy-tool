import '@testing-library/jest-dom'

// Mock IntersectionObserver for jsdom — immediately marks elements as visible
// so ScrollReveal content is accessible in all tests.
global.IntersectionObserver = class IntersectionObserverMock {
  private callback: IntersectionObserverCallback
  root = null
  rootMargin = ''
  thresholds: number[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    // Immediately trigger as visible
    this.callback(
      [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }

  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
} as unknown as typeof IntersectionObserver
