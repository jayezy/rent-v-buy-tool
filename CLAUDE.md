# CLAUDE.md — Project Intelligence

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

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

### Saved Results with localStorage

Completed analyses are auto-saved to localStorage and displayed as "Previous Analyses" cards on the landing page.

- **Type**: `SavedResult` in `types.ts` — contains `id`, `savedAt`, `label`, full `answers`, `result`, and `assumptionOverrides`
- **Storage**: `src/lib/storage.ts` — pure utility functions: `loadSavedResults()`, `saveSavedResults()`, `generateResultLabel()`
- **Storage key**: `homewise_results` in localStorage
- **Auto-save**: Every completed wizard run auto-saves via `SET_ANSWER` on the last step. No manual "Save" button needed.
- **Reducer actions**:
  - `LOAD_SAVED_RESULT` — restores a saved analysis to the results view
  - `DELETE_SAVED_RESULT` — removes a single saved result
  - `CLEAR_ALL_SAVED` — removes all saved results
- **RESET preserves savedResults** — clicking "Start Over" keeps the history intact
- **Label format**: Auto-generated as `"$500K home · CA · 10yr"` from answers (zip code → state abbreviation)
- **Landing page**: "Previous Analyses" section only renders when `savedResults.length > 0`

### Zip Code Location + State-Level Data

The location question uses a 5-digit zip code input instead of broad regional categories. This enables state-specific property tax and insurance rates.

- **State data**: `src/lib/stateData.ts` — `STATE_DATA` record with all 50 states + DC, each with `propertyTaxRate` and `insuranceRate`
- **Zip mapping**: `src/lib/zipToState.ts` — `ZIP_PREFIX_TO_STATE` maps 3-digit zip prefixes to state abbreviations using USPS prefix ranges
- **Lookup**: `getLocationData(location)` in `stateData.ts` accepts zip codes, state abbreviations, or legacy region keys. Falls back to `NATIONAL_AVERAGE` for unrecognized inputs.
- **Input**: `CustomValueInput.tsx` handles `type: 'zip'` with `inputMode="numeric"`, max 5 digits, shows state name hint on valid entry
- **Backward compatibility**: Old saved results with legacy keys (e.g., `'westCoast'`) still work — `getLocationData()` returns national averages, `generateResultLabel()` maps them to readable names via `LEGACY_LOCATION_LABELS`
- **Territories excluded**: Puerto Rico, Guam, and military APO/FPO codes return `null` from `zipToState()` — only 50 states + DC are valid

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
