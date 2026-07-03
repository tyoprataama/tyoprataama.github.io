import { useState } from 'react'

// Toggles the `dark` class on <html> and persists the choice.
// The initial theme is applied pre-paint by a small script in index.html.
export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )

  const toggle = () => {
    const next = document.documentElement.classList.toggle('dark')
    setDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <button className="tglr" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  )
}
