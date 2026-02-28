import { useWizard } from './context/WizardContext'
import LandingPage from './components/landing/LandingPage'
import WizardModal from './components/wizard/WizardModal'
import ResultsDashboard from './components/results/ResultsDashboard'

export default function App() {
  const { state } = useWizard()

  if (state.view === 'results' && state.results) {
    return <ResultsDashboard result={state.results} />
  }

  return (
    <>
      <LandingPage />
      {state.view === 'wizard' && <WizardModal />}
    </>
  )
}
