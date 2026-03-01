import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const CYCLE = ['system', 'light', 'dark'] as const

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function handleClick() {
    const currentIndex = CYCLE.indexOf(theme)
    const next = CYCLE[(currentIndex + 1) % CYCLE.length]
    setTheme(next)
  }

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <button
      onClick={handleClick}
      aria-label={`Theme: ${theme}`}
      className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800
        transition-colors cursor-pointer"
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
