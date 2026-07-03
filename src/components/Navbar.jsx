import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
]

// Floating glass masthead (Apple-style): serif wordmark, quiet nav, theme toggle.
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

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
              {s.label}
            </a>
          ))}
          <Link className="navlink" to="/blog">
            Writing
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
