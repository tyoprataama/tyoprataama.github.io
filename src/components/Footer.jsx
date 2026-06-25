import { useEffect, useState } from 'react'
import { fetchLastUpdated } from '../api/articles.js'
import { formatShortDate } from '../lib/helpers.js'

// Persistent footer rendered by RootLayout on every page.
// "Last update" otomatis mengikuti artikel yang terakhir ditambah/diedit.
export default function Footer() {
  const [lastUpdate, setLastUpdate] = useState('')

  useEffect(() => {
    let alive = true
    fetchLastUpdated()
      .then((d) => alive && d && setLastUpdate(formatShortDate(d)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <footer className="relative z-[1] py-8 text-center text-[0.78rem] text-ink-muted">
      <p>
        made with <span className="text-accent-coral">♥</span> by Tyo Putra &copy; 2026.
        {lastUpdate && <> Last update: {lastUpdate}</>}
      </p>
    </footer>
  )
}
