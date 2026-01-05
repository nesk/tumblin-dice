import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply dark mode based on system preference
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

applyTheme(darkModeMediaQuery.matches)
darkModeMediaQuery.addEventListener('change', (e) => applyTheme(e.matches))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
