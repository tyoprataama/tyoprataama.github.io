import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const sections = [
  { id: 'work', label: 'Work', labelId: 'Pekerjaan' },
  { id: 'about', label: 'About', labelId: 'Tentang' },
  { id: 'experience', label: 'Experience', labelId: 'Pengalaman' },
]

// Floating glass masthead (Apple-style): serif wordmark, quiet nav, theme toggle.
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (id) => (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/#' + id)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`mast${scrolled ? ' scrolled' : ''}`}>
      <div className="mast-inner">
        <Link to="/" className="brand">
          Ty<em>ooo</em>.
        </Link>
        <div className="navwrap">
          {sections.map((s) => (
            <a key={s.id} className="navlink" href={'/#' + s.id} onClick={goToSection(s.id)}>
              {language === 'id' ? s.labelId : s.label}
            </a>
          ))}
          <Link className="navlink" to="/blog">
            {language === 'id' ? 'Tulisan' : 'Writing'}
          </Link>
          <div className="language-menu-wrap">
            <button
              type="button"
              className="language-toggle"
              aria-label={language === 'id' ? 'Pilih bahasa. Saat ini Indonesia' : 'Choose language. Current language English'}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              onClick={() => setLanguageMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{language === 'id' ? '🇮🇩' : '🇺🇸'}</span>
            </button>
            {languageMenuOpen && (
              <div className="language-dropdown" role="menu" aria-label="Pilih bahasa">
                <button type="button" role="menuitem" className={language === 'id' ? 'language-option active' : 'language-option'} onClick={() => { setLanguage('id'); setLanguageMenuOpen(false) }}>
                  <span className="language-option-flag" aria-hidden="true">🇮🇩</span><span className="language-option-copy"><strong>Indonesia</strong><small>Bahasa Indonesia</small></span>{language === 'id' && <span className="language-check">✓</span>}
                </button>
                <button type="button" role="menuitem" className={language === 'en' ? 'language-option active' : 'language-option'} onClick={() => { setLanguage('en'); setLanguageMenuOpen(false) }}>
                  <span className="language-option-flag" aria-hidden="true">🇺🇸</span><span className="language-option-copy"><strong>English</strong><small>English (United States)</small></span>{language === 'en' && <span className="language-check">✓</span>}
                </button>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
