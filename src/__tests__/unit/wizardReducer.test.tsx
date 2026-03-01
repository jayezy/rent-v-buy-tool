/**
 * Unit tests for the wizard reducer logic.
 * We test the reducer in isolation by importing the WizardContext module
 * and calling the internal reducer through the exported hook indirectly,
 * or directly via renderHook + WizardProvider.
 */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { WizardProvider, useWizard } from '../../context/WizardContext'
import { QUESTIONS } from '../../lib/constants'

function wrapper({ children }: { children: ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>
}

describe('WizardContext — initial state', () => {
  it('starts on step 0', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    expect(result.current.state.currentStep).toBe(0)
  })

  it('starts with no answers', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    expect(result.current.state.answers).toEqual({})
  })

  it('starts in landing view by default', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    expect(result.current.state.view).toBe('landing')
  })

  it('starts with null results', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    expect(result.current.state.results).toBeNull()
  })
})

describe('WizardContext — SET_ANSWER action', () => {
  it('advances currentStep by 1 after setting an answer', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 125000 })
    })
    expect(result.current.state.currentStep).toBe(1)
  })

  it('stores the answer in state.answers', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    expect(result.current.state.answers.annualIncome).toBe(87500)
  })

  it('accumulates answers across steps', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'monthlyBudget', value: 3000 })
    })
    expect(result.current.state.answers.annualIncome).toBe(87500)
    expect(result.current.state.answers.monthlyBudget).toBe(3000)
    expect(result.current.state.currentStep).toBe(2)
  })
})

describe('WizardContext — GO_BACK action', () => {
  it('decrements currentStep by 1', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    expect(result.current.state.currentStep).toBe(1)
    act(() => {
      result.current.dispatch({ type: 'GO_BACK' })
    })
    expect(result.current.state.currentStep).toBe(0)
  })

  it('does not go below step 0', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'GO_BACK' })
    })
    expect(result.current.state.currentStep).toBe(0)
  })

  it('retains previously stored answers after going back', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    act(() => {
      result.current.dispatch({ type: 'GO_BACK' })
    })
    expect(result.current.state.answers.annualIncome).toBe(87500)
  })
})

describe('WizardContext — RESET action', () => {
  it('resets step to 0', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    act(() => {
      result.current.dispatch({ type: 'RESET' })
    })
    expect(result.current.state.currentStep).toBe(0)
  })

  it('clears all answers', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    act(() => {
      result.current.dispatch({ type: 'RESET' })
    })
    expect(result.current.state.answers).toEqual({})
  })

  it('returns to wizard view', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'RESET' })
    })
    expect(result.current.state.view).toBe('wizard')
  })
})

describe('WizardContext — GO_TO_LANDING action', () => {
  it('switches view to landing', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'GO_TO_WIZARD' })
    })
    expect(result.current.state.view).toBe('wizard')
    act(() => {
      result.current.dispatch({ type: 'GO_TO_LANDING' })
    })
    expect(result.current.state.view).toBe('landing')
  })

  it('preserves current step when returning to landing', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: 'GO_TO_WIZARD' })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'annualIncome', value: 87500 })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_ANSWER', questionId: 'monthlyBudget', value: 3000 })
    })
    expect(result.current.state.currentStep).toBe(2)
    act(() => {
      result.current.dispatch({ type: 'GO_TO_LANDING' })
    })
    expect(result.current.state.view).toBe('landing')
    expect(result.current.state.currentStep).toBe(2)
    expect(result.current.state.answers.annualIncome).toBe(87500)
    expect(result.current.state.answers.monthlyBudget).toBe(3000)
  })
})

describe('WizardContext — completing all steps', () => {
  function answerAll(dispatch: ReturnType<typeof useWizard>['dispatch']) {
    QUESTIONS.forEach(q => {
      const value = q.options.length > 0 ? q.options[0].value : '90210'
      act(() => {
        dispatch({ type: 'SET_ANSWER', questionId: q.id, value })
      })
    })
  }

  it('transitions to results view after answering all 10 questions', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(result.current.state.view).toBe('results')
  })

  it('populates results after completing the wizard', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(result.current.state.results).not.toBeNull()
  })

  it('results contain a recommendation', () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    answerAll(result.current.dispatch)
    expect(['buy', 'rent']).toContain(result.current.state.results?.recommendation)
  })
})
