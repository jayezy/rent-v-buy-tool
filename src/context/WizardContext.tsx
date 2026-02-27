import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { WizardAnswers, ProjectionResult } from '../lib/types'
import { QUESTIONS } from '../lib/constants'
import { calculateProjections } from '../lib/calculations'

type AppView = 'wizard' | 'results'

interface WizardState {
  currentStep: number
  answers: Partial<WizardAnswers>
  view: AppView
  results: ProjectionResult | null
}

type WizardAction =
  | { type: 'SET_ANSWER'; questionId: keyof WizardAnswers; value: number | string }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }

const initialState: WizardState = {
  currentStep: 0,
  answers: {},
  view: 'wizard',
  results: null,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_ANSWER': {
      const newAnswers = { ...state.answers, [action.questionId]: action.value }
      const isLastStep = state.currentStep === QUESTIONS.length - 1

      if (isLastStep) {
        const results = calculateProjections(newAnswers as WizardAnswers)
        return { ...state, answers: newAnswers, view: 'results', results }
      }

      return { ...state, answers: newAnswers, currentStep: state.currentStep + 1 }
    }
    case 'GO_BACK':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface WizardContextValue {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
