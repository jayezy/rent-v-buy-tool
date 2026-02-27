import { useWizard } from '../../context/WizardContext'
import { QUESTIONS } from '../../lib/constants'
import type { WizardAnswers } from '../../lib/types'
import ProgressBar from '../ui/ProgressBar'
import QuestionStep from './QuestionStep'

export default function WizardContainer() {
  const { state, dispatch } = useWizard()
  const question = QUESTIONS[state.currentStep]

  const handleSelect = (value: number | string) => {
    // Brief delay so user sees their selection before advancing
    setTimeout(() => {
      dispatch({ type: 'SET_ANSWER', questionId: question.id, value })
    }, 250)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
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
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl" key={state.currentStep}>
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
