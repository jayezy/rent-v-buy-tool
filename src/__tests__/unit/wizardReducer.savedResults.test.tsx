/**
 * Unit tests for the saved results reducer actions:
 * LOAD_SAVED_RESULT, DELETE_SAVED_RESULT, CLEAR_ALL_SAVED,
 * and auto-save on wizard completion.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { WizardProvider, useWizard } from '../../context/WizardContext'
import { QUESTIONS } from '../../lib/constants'
import { STORAGE_KEY } from '../../lib/storage'

function wrapper({ children }: { children: ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>
}

beforeEach(() => {
  localStorage.clear()
})

describe('WizardContext — auto-save on completion', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('saves a result to savedResults when completing the wizard', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(1)
  })

  it('saved result has correct structure', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    const saved = result.current.state.savedResults[0]
    expect(saved).toHaveProperty('id')
    expect(saved).toHaveProperty('savedAt')
    expect(saved).toHaveProperty('label')
    expect(saved).toHaveProperty('answers')
    expect(saved).toHaveProperty('result')
    expect(saved).toHaveProperty('assumptionOverrides')
    expect(saved.result.recommendation).toBeDefined()
  })

  it('persists to localStorage on completion', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })

  it('accumulates multiple completions', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    // First completion
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(1)

    // Reset and complete again
    act(() => { result.current.dispatch({ type: 'RESET' }) })
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(2)
  })

  it('newest result is first in the array', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    const firstId = result.current.state.savedResults[0].id

    act(() => { result.current.dispatch({ type: 'RESET' }) })
    answerAll(result.current.dispatch)

    expect(result.current.state.savedResults).toHaveLength(2)
    // The newest should be at index 0 (different from the first one)
    expect(result.current.state.savedResults[0].id).not.toBe(firstId)
  })
})

describe('WizardContext — LOAD_SAVED_RESULT', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('restores answers and results from a saved result', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    const savedId = result.current.state.savedResults[0].id
    const savedResult = result.current.state.savedResults[0].result

    // Navigate away and reset
    act(() => { result.current.dispatch({ type: 'RESET' }) })
    expect(result.current.state.results).toBeNull()

    // Load saved result
    act(() => { result.current.dispatch({ type: 'LOAD_SAVED_RESULT', id: savedId }) })
    expect(result.current.state.view).toBe('results')
    expect(result.current.state.results).toEqual(savedResult)
  })

  it('does nothing for a non-existent id', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    const viewBefore = result.current.state.view
    act(() => { result.current.dispatch({ type: 'LOAD_SAVED_RESULT', id: 'nonexistent' }) })
    expect(result.current.state.view).toBe(viewBefore)
  })
})

describe('WizardContext — DELETE_SAVED_RESULT', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('removes a saved result by id', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(1)

    const id = result.current.state.savedResults[0].id
    act(() => { result.current.dispatch({ type: 'DELETE_SAVED_RESULT', id }) })
    expect(result.current.state.savedResults).toHaveLength(0)
  })

  it('updates localStorage after deletion', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)

    const id = result.current.state.savedResults[0].id
    act(() => { result.current.dispatch({ type: 'DELETE_SAVED_RESULT', id }) })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(0)
  })
})

describe('WizardContext — CLEAR_ALL_SAVED', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('clears all saved results', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    act(() => { result.current.dispatch({ type: 'RESET' }) })
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(2)

    act(() => { result.current.dispatch({ type: 'CLEAR_ALL_SAVED' }) })
    expect(result.current.state.savedResults).toHaveLength(0)
  })

  it('clears localStorage', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)

    act(() => { result.current.dispatch({ type: 'CLEAR_ALL_SAVED' }) })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(0)
  })
})

describe('WizardContext — RESET preserves savedResults', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('keeps savedResults after RESET', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(result.current.state.savedResults).toHaveLength(1)

    act(() => { result.current.dispatch({ type: 'RESET' }) })
    expect(result.current.state.savedResults).toHaveLength(1)
  })
})

describe('WizardContext — persist assumption overrides', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('UPDATE_ASSUMPTIONS persists overrides to localStorage', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)

    act(() => {
      result.current.dispatch({ type: 'UPDATE_ASSUMPTIONS', overrides: { mortgageRate: 0.05 } })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].assumptionOverrides).toEqual({ mortgageRate: 0.05 })
  })

  it('CLEAR_ASSUMPTIONS persists cleared overrides to localStorage', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)

    // First set some overrides
    act(() => {
      result.current.dispatch({ type: 'UPDATE_ASSUMPTIONS', overrides: { mortgageRate: 0.05 } })
    })

    // Then clear them
    act(() => {
      result.current.dispatch({ type: 'CLEAR_ASSUMPTIONS' })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].assumptionOverrides).toEqual({})
  })
})

describe('WizardContext — persist answer edits', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('UPDATE_ANSWER persists the updated answer to localStorage', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)

    act(() => {
      result.current.dispatch({ type: 'UPDATE_ANSWER', questionId: 'annualIncome', value: 200000 })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].answers.annualIncome).toBe(200000)
  })

  it('UPDATE_ANSWER regenerates the label when homePrice changes', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    const originalLabel = result.current.state.savedResults[0].label

    act(() => {
      result.current.dispatch({ type: 'UPDATE_ANSWER', questionId: 'homePrice', value: 1750000 })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].label).not.toBe(originalLabel)
    expect(stored[0].label).toContain('$1.8M')
  })
})
