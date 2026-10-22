import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import usaFlag from '/assets/usa.png'

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
          ty<em>0oo</em>.
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



<button
  type="button"
  className={`language-toggle ${language === 'en' ? 'is-english' : 'is-indonesian'}`}
  aria-label={
    language === 'id'
      ? 'Switch language to English'
      : 'Ganti bahasa ke Indonesia'
  }
  title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}>
  <span className="language-toggle-track">
    <span className="language-toggle-thumb">
      {language === 'id' ? (
        <span
        className="language-toggle-flag flag-indonesia"
        aria-hidden="true"
        />
      ) : (
        <img
        className="language-toggle-flag"
        src={usaFlag}
        alt=""
        />
)}

    </span>
  </span>
</button>




          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
