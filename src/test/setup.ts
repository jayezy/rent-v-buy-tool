import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Note: IntersectionObserver mock is no longer needed — ScrollReveal now uses
// Motion's useInView which is mocked via the Vite alias to __mocks__/motion-react.tsx.
// The mock returns true by default, making all ScrollReveal content visible in tests.

// jsdom doesn't implement scrollIntoView — stub it globally
Element.prototype.scrollIntoView = () => {}

// jsdom doesn't implement matchMedia — stub it globally for ThemeContext
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
