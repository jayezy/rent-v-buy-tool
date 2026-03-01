import '@testing-library/jest-dom'

// Note: IntersectionObserver mock is no longer needed — ScrollReveal now uses
// Motion's useInView which is mocked via the Vite alias to __mocks__/motion-react.tsx.
// The mock returns true by default, making all ScrollReveal content visible in tests.
