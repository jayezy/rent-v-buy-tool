# CLAUDE.md — Project Intelligence

This file captures patterns, decisions, and lessons learned during development of the HomeWise Rent vs. Buy Calculator. It serves as context for any future Claude sessions working on this codebase.

---

## Project Overview

- **What**: A financial decision tool that helps users decide whether to buy a home or rent and invest the difference.
- **Stack**: React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + Recharts 3
- **State**: `useReducer` + React Context (no Redux, no router library)
- **Testing**: Vitest 4 + Testing Library + jsdom

---

## Development Principles

### 1. Always Set Up a Test Suite from Day One

Set up the test infrastructure at the start of the project, not as an afterthought. This project uses Vitest with three tiers:

- **Unit tests** (`__tests__/unit/`) — Pure logic: calculations, reducer, constants
- **Component tests** (`__tests__/components/`) — Render + interaction for each component
- **Integration tests** (`__tests__/integration/`) — Full user flows across multiple components

**Run tests after every meaningful change.** The test suite should be a living contract that evolves with the code. When adding a new feature, write the tests alongside it — never defer test creation to "later."

```bash
npm run test:run    # Single run (CI)
npm test            # Watch mode (development)
npm run test:coverage  # Coverage report
```

### 2. Maintain Tests as You Develop

When modifying existing behavior, **update the tests in the same commit**. Common situations:

- **New component** → Create a matching test file in `__tests__/components/`
- **New action in reducer** → Add test cases to `wizardReducer.test.tsx`
- **Changed default values** → Update unit tests that assert on those values
- **Changed routing/views** → Update integration tests that navigate between views

Never leave tests in a broken state between commits.

### 3. Keep the Financial Engine Pure

`calculations.ts` is a **pure function** — no side effects, no state, no DOM. It takes `WizardAnswers` + optional `AssumptionOverrides` and returns a `ProjectionResult`. This makes it:

- Trivially testable (31+ unit tests)
- Easy to extend with new financial models
- Safe to call from anywhere (reducer, components, scripts)

### 4. State-Driven Navigation over Router Libraries

This app uses `view: 'landing' | 'wizard' | 'results'` in the reducer state instead of React Router. This works well for linear flows (landing → quiz → results) and avoids:

- URL synchronization complexity
- Route guard boilerplate
- Extra bundle size

For apps with deep linking or shareable URLs, consider adding a router.

---

## Architecture Decisions & Patterns

### Modal Overlay Pattern for Wizard

The wizard runs as a `role="dialog"` modal overlay on top of the landing page, not as a separate route. Key decisions:

- `GO_TO_LANDING` action **preserves** `currentStep` and `answers` so the user can resume
- `RESET` action clears everything and goes to `view: 'wizard'` (step 0)
- Body scroll is locked when modal is open (`document.body.style.overflow = 'hidden'`)
- Escape key and backdrop click both dismiss the modal

### Assumption Overrides Pattern

Users can adjust 6 economic rates on the results page. The pattern is:

```typescript
const rates = { ...DEFAULTS, ...overrides };
```

- `DEFAULTS` in `constants.ts` — the source of truth for market rates
- `assumptionOverrides: Partial<AssumptionOverrides>` — only stores what the user changed
- `CLEAR_ASSUMPTIONS` resets overrides to `{}` (not to DEFAULTS) — the merge handles it
- Results recalculate immediately on any slider change

### ScrollReveal with IntersectionObserver

`ScrollReveal.tsx` is a wrapper component that fades children in when they enter the viewport:

- One-shot animation: observer disconnects after first intersection
- Configurable: direction, delay, threshold
- Respects `prefers-reduced-motion` via CSS media query
- Requires a global IO mock in tests (see Testing section)

---

## Testing Lessons

### jsdom Doesn't Support IntersectionObserver

jsdom has no `IntersectionObserver` implementation. The solution is a global mock in `test/setup.ts` that immediately triggers `isIntersecting: true`:

```typescript
global.IntersectionObserver = class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) { this.callback = callback; }
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
} as unknown as typeof IntersectionObserver;
```

To test the **hidden** (pre-intersection) state, override the global mock in the specific test with a no-op class:

```typescript
global.IntersectionObserver = class NoOpObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  root = null;
  rootMargin = '';
  thresholds = [] as number[];
} as unknown as typeof IntersectionObserver;
```

**Important**: Use a real `class` for the mock, not `vi.fn(() => ({...}))`. Arrow function mocks are not constructable and will throw `TypeError: ... is not a constructor`.

### Recharts SVGs Don't Render in jsdom

Recharts renders SVG elements that jsdom can't handle. The mock at `__mocks__/recharts.tsx` replaces chart components with simple `<div>` stubs. This allows testing that charts are present without rendering actual SVGs.

### Scoping Queries When Modal + Page Coexist

When the wizard modal is open, both the landing page buttons AND modal buttons are in the DOM. Use `within()` from Testing Library to scope queries:

```typescript
import { within } from '@testing-library/react';

const dialog = screen.getByRole('dialog');
const buttons = within(dialog).getAllByRole('button');
```

All integration tests (`wizardFlow.test.tsx`, `landingToWizard.test.tsx`) use this pattern to avoid query collisions.

### Test Provider Setup

Components that use `useWizard()` must be wrapped in `WizardProvider`. The provider accepts an `initialView` prop:

```typescript
<WizardProvider initialView="wizard">
  <ComponentUnderTest />
</WizardProvider>
```

Use `initialView="wizard"` for wizard/flow tests, `initialView="landing"` for landing page tests.

---

## CSS & Styling Notes

### Tailwind CSS v4 Setup

This project uses Tailwind CSS v4 with the Vite plugin (`@tailwindcss/vite`), NOT the PostCSS plugin. The theme is defined with CSS custom properties in `index.css`, not `tailwind.config.js`.

### Pastel Theme Color Palette

```
Primary:    #8b5cf6 (violet-500)
Rent color: #ec4899 (pink-500)
Buy color:  #6366f1 (indigo-500)
Body:       linear-gradient(135deg, #fff1f2, #faf5ff, #f0f9ff)
```

### Glass Utility Class

```css
.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Animated Background Blobs

Three absolutely positioned blobs with CSS `@keyframes` (`blob-drift`, `blob-drift-reverse`) animate at 20-30 second cycles. Respects `prefers-reduced-motion`.

---

## File Organization Conventions

```
src/
├── components/{domain}/     # Grouped by feature domain
│   ├── landing/             # Landing page components
│   ├── wizard/              # Quiz/survey components
│   ├── results/             # Results dashboard components
│   └── ui/                  # Shared UI primitives
├── context/                 # React Context providers
├── lib/                     # Pure logic (no React imports)
│   ├── calculations.ts      # Financial engine
│   ├── constants.ts         # Questions, defaults, rates
│   └── types.ts             # All TypeScript interfaces
├── test/                    # Test infrastructure
└── __tests__/               # Mirrors src/ structure
    ├── unit/
    ├── components/
    └── integration/
```

- **`lib/`** has zero React imports — pure TypeScript only
- **`context/`** owns all state management
- **`__tests__/`** mirrors the source structure for discoverability
- Test mocks live in `__tests__/__mocks__/`

---

## Common Commands

```bash
npm run dev          # Start Vite dev server on :5173
npm run build        # TypeScript check + production build
npm run test:run     # Run all 188 tests (single pass)
npm test             # Watch mode
npm run test:coverage  # Generate coverage report
npm run lint         # ESLint

# Capture README screenshots (requires dev server running)
node scripts/capture-screenshots.mjs
```

---

## Git Workflow

- **Branch**: `claude/sleepy-wozniak` (feature branch)
- **Base**: `main`
- Commits should include test updates alongside feature changes
- The screenshot capture script (`scripts/capture-screenshots.mjs`) can regenerate `docs/screenshots/` at any time

---

## Known Patterns to Watch For

1. **Adding a new question**: Update `QUESTIONS` array in `constants.ts`, add a `QuestionOption` + optional `CustomInputConfig`, update `WizardAnswers` type in `types.ts`, update the calculation in `calculations.ts`, and add test cases.

2. **Adding a new assumption override**: Add the field to `AssumptionOverrides` in `types.ts`, add it to `DEFAULTS` in `constants.ts`, add a slider in `AssumptionsEditor.tsx`, and verify the override flows through `calculateProjections()`.

3. **Adding a new view**: Add it to the `AppView` union type, add a new action to the reducer in `WizardContext.tsx`, update `App.tsx` routing, and add integration tests.

4. **Changing default rates**: Update `DEFAULTS` in `constants.ts`. This will affect ALL tests that assert on calculated values. Run the full suite and fix snapshots/assertions.

---

## Debugging Tips

- **Blank results page**: Check that all 10 questions have answers. The reducer only calls `calculateProjections()` on the last `SET_ANSWER` if `Object.keys(answers).length === QUESTIONS.length`.
- **Tests failing after UI restructure**: Check if queries are colliding between landing page and wizard modal. Use `within(dialog)` scoping.
- **Blob animations janky**: The blobs use `will-change: transform` and run on the compositor thread. If janky, check for layout-triggering properties nearby.
- **`prefers-reduced-motion` not working**: The media query is in `index.css` and disables blob animations + reduces scroll-bounce. Check that the CSS is loaded.
