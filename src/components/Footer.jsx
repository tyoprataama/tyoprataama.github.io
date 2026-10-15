
import { useEffect, useState } from 'react'
import { fetchLastUpdated } from '../api/articles.js'
import { useLanguage } from '../context/LanguageContext.jsx'

// Minimal footer rendered on every page.
export default function Footer() {
  const { language } = useLanguage()
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    let alive = true
    fetchLastUpdated()
      .then((d) => {
        if (alive && d) {
          setLastUpdate(d)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const isId = language === 'id'

  const formattedDate = lastUpdate
    ? new Intl.DateTimeFormat(isId ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(lastUpdate))
    : ''

  return (
    <footer className="foot">
      <div className="wrap row">
        <div className="c">
          Tyo Pratama Priyanto Putra © {new Date().getFullYear()}
          {formattedDate &&
            ` · ${isId ? 'Terakhir diperbarui' : 'Last update'}: ${formattedDate}`}
        </div>

        <div className="s">
          <a href="mailto:tyopriyantoputra@gmail.com">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
