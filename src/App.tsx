import { AnimatePresence, motion } from 'motion/react'
import { useWizard } from './context/WizardContext'
import LandingPage from './components/landing/LandingPage'
import WizardModal from './components/wizard/WizardModal'
import ResultsDashboard from './components/results/ResultsDashboard'

export default function App() {
  const { state } = useWizard()

  return (
    <AnimatePresence mode="wait">
      {state.view === 'results' && state.results ? (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultsDashboard result={state.results} />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage />
          <AnimatePresence>
            {state.view === 'wizard' && <WizardModal />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
