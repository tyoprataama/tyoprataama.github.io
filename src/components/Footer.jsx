import { useEffect, useState } from 'react'
import { fetchLastUpdated } from '../api/articles.js'
import { formatShortDate } from '../lib/helpers.js'

// Minimal footer rendered on every page. "Updated" mengikuti artikel terbaru.
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
    <footer className="foot">
      <div className="wrap row">
        <div className="c">
         Tyo Putra · Made with 💙 © 2026 {
           lastUpdate && ` · Last update: ${lastUpdate}`
         }
        </div>
        <div className="s">
          <a href="mailto:tyopriyantoputra@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  )
}
