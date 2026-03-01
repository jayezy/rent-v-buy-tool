import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { WizardProvider } from './context/WizardContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <WizardProvider>
        <App />
      </WizardProvider>
    </ThemeProvider>
  </StrictMode>,
)
