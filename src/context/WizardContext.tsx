import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppView, WizardAnswers, ProjectionResult, AssumptionOverrides, SavedResult } from '../lib/types'
import { QUESTIONS } from '../lib/constants'
import { calculateProjections } from '../lib/calculations'
import { loadSavedResults, saveSavedResults, generateResultLabel } from '../lib/storage'

interface WizardState {
  currentStep: number
  answers: Partial<WizardAnswers>
  view: AppView
  results: ProjectionResult | null
  assumptionOverrides: Partial<AssumptionOverrides>
  savedResults: SavedResult[]
  activeSavedResultId: string | null
}

type WizardAction =
  | { type: 'SET_ANSWER'; questionId: keyof WizardAnswers; value: number | string }
  | { type: 'UPDATE_ANSWER'; questionId: keyof WizardAnswers; value: number | string }
  | { type: 'GO_BACK' }
  | { type: 'GO_TO_WIZARD' }
  | { type: 'GO_TO_LANDING' }
  | { type: 'UPDATE_ASSUMPTIONS'; overrides: Partial<AssumptionOverrides> }
  | { type: 'CLEAR_ASSUMPTIONS' }
  | { type: 'RESET' }
  | { type: 'LOAD_SAVED_RESULT'; id: string }
  | { type: 'DELETE_SAVED_RESULT'; id: string }
  | { type: 'CLEAR_ALL_SAVED' }

const initialState: WizardState = {
  currentStep: 0,
  answers: {},
  view: 'landing',
  results: null,
  assumptionOverrides: {},
  savedResults: loadSavedResults(),
  activeSavedResultId: null,
}

/** Create a SavedResult and prepend it to the array, persisting to localStorage */
function addSavedResult(
  savedResults: SavedResult[],
  answers: WizardAnswers,
  result: ProjectionResult,
  overrides: Partial<AssumptionOverrides>,
): { savedResults: SavedResult[]; id: string } {
  const id = crypto.randomUUID()
  const saved: SavedResult = {
    id,
    savedAt: Date.now(),
    label: generateResultLabel(answers),
    answers,
    result,
    assumptionOverrides: overrides,
  }
  const updated = [saved, ...savedResults]
  saveSavedResults(updated)
  return { savedResults: updated, id }
}

/** Update the active SavedResult in-place and persist to localStorage */
function updateActiveSavedResult(
  savedResults: SavedResult[],
  activeId: string | null,
  answers: WizardAnswers,
  result: ProjectionResult,
  overrides: Partial<AssumptionOverrides>,
): SavedResult[] {
  if (!activeId) return savedResults
  const updated = savedResults.map(s =>
    s.id === activeId
      ? { ...s, answers, result, assumptionOverrides: overrides, label: generateResultLabel(answers) }
      : s
  )
  saveSavedResults(updated)
  return updated
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_ANSWER': {
      const newAnswers = { ...state.answers, [action.questionId]: action.value }
      const isLastStep = state.currentStep === QUESTIONS.length - 1

      if (isLastStep) {
        const results = calculateProjections(newAnswers as WizardAnswers, state.assumptionOverrides)
        const { savedResults: newSaved, id: newId } = addSavedResult(
          state.savedResults,
          newAnswers as WizardAnswers,
          results,
          state.assumptionOverrides,
        )
        return { ...state, answers: newAnswers, view: 'results', results, savedResults: newSaved, activeSavedResultId: newId }
      }

      return { ...state, answers: newAnswers, currentStep: state.currentStep + 1 }
    }
    case 'UPDATE_ANSWER': {
      const newAnswers = { ...state.answers, [action.questionId]: action.value } as WizardAnswers
      const newResults = calculateProjections(newAnswers, state.assumptionOverrides)
      const updatedSaved = updateActiveSavedResult(
        state.savedResults,
        state.activeSavedResultId,
        newAnswers,
        newResults,
        state.assumptionOverrides,
      )
      return { ...state, answers: newAnswers, results: newResults, savedResults: updatedSaved }
    }
    case 'GO_BACK':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      }
    case 'GO_TO_WIZARD':
      return { ...state, view: 'wizard' }
    case 'GO_TO_LANDING':
      return { ...state, view: 'landing' }
    case 'UPDATE_ASSUMPTIONS': {
      const newOverrides = { ...state.assumptionOverrides, ...action.overrides }
      const newResults =
        state.results && Object.keys(state.answers).length === QUESTIONS.length
          ? calculateProjections(state.answers as WizardAnswers, newOverrides)
          : state.results
      const updatedSaved = newResults
        ? updateActiveSavedResult(state.savedResults, state.activeSavedResultId, state.answers as WizardAnswers, newResults, newOverrides)
        : state.savedResults
      return { ...state, assumptionOverrides: newOverrides, results: newResults, savedResults: updatedSaved }
    }
    case 'CLEAR_ASSUMPTIONS': {
      const cleared = state.results && Object.keys(state.answers).length === QUESTIONS.length
        ? calculateProjections(state.answers as WizardAnswers, {})
        : state.results
      const updatedSaved = cleared
        ? updateActiveSavedResult(state.savedResults, state.activeSavedResultId, state.answers as WizardAnswers, cleared, {})
        : state.savedResults
      return { ...state, assumptionOverrides: {}, results: cleared, savedResults: updatedSaved }
    }
    case 'RESET':
      // Return to question 1 (wizard view), keeping saved results + overrides cleared
      return { ...initialState, view: 'wizard', savedResults: state.savedResults }
    case 'LOAD_SAVED_RESULT': {
      const saved = state.savedResults.find(s => s.id === action.id)
      if (!saved) return state
      return {
        ...state,
        answers: saved.answers,
        results: saved.result,
        assumptionOverrides: saved.assumptionOverrides,
        view: 'results',
        currentStep: QUESTIONS.length - 1,
        activeSavedResultId: saved.id,
      }
    }
    case 'DELETE_SAVED_RESULT': {
      const filtered = state.savedResults.filter(s => s.id !== action.id)
      saveSavedResults(filtered)
      return { ...state, savedResults: filtered }
    }
    case 'CLEAR_ALL_SAVED': {
      saveSavedResults([])
      return { ...state, savedResults: [] }
    }
    default:
      return state
  }
}

interface WizardContextValue {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({
  children,
  initialView = 'landing',
}: {
  children: ReactNode
  initialView?: AppView
}) {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    view: initialView,
  })
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
