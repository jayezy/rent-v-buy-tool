import { useEffect } from 'react'
import { useWizard } from '../../context/WizardContext'
import { QUESTIONS } from '../../lib/constants'
import type { WizardAnswers } from '../../lib/types'
import ProgressBar from '../ui/ProgressBar'
import QuestionStep from './QuestionStep'

export default function WizardModal() {
  const { state, dispatch } = useWizard()
  const question = QUESTIONS[state.currentStep]

  const close = () => dispatch({ type: 'GO_TO_LANDING' })

  const handleSelect = (value: number | string) => {
    setTimeout(() => {
      dispatch({ type: 'SET_ANSWER', questionId: question.id, value })
    }, 250)
  }

  // Escape key closes the modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Survey"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto
          bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10
          border border-white/50 animate-fade-in"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-t-3xl border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-4">
            {state.currentStep > 0 && (
              <button
                onClick={() => dispatch({ type: 'GO_BACK' })}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-1">
              <ProgressBar currentStep={state.currentStep} />
            </div>
            <button
              onClick={close}
              className="p-2 -mr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close survey"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question content */}
        <div className="px-6 py-8 sm:py-10" key={state.currentStep}>
          <QuestionStep
            question={question}
            selectedValue={state.answers[question.id as keyof WizardAnswers]}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}
