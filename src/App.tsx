import { useWizard } from './context/WizardContext'
import WizardContainer from './components/wizard/WizardContainer'
import ResultsDashboard from './components/results/ResultsDashboard'

export default function App() {
  const { state } = useWizard()

  if (state.view === 'results' && state.results) {
    return <ResultsDashboard result={state.results} />
  }

  return <WizardContainer />
}
