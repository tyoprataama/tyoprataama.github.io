import { Link, useNavigate, useLocation } from 'react-router-dom'

const sections = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
]

// Persistent floating glass navbar shown on every page.
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Smooth-scroll to a section on the home page, navigating home first if needed.
  const goToSection = (id) => (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/#' + id)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="glass animate-navIn fixed left-1/2 top-4 z-[100] flex w-[min(680px,calc(100%-32px))] -translate-x-1/2 items-center justify-between rounded-full px-6 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <Link to="/" className="font-serif text-[1.05rem] tracking-[-0.02em] text-ink">
        Tyooooo
      </Link>

      <div className="hidden items-center gap-1 sm:flex">
        {sections.map((s) => (
          <a
            key={s.id}
            href={'/#' + s.id}
            onClick={goToSection(s.id)}
            className="rounded-[30px] px-3 py-1.5 text-[0.82rem] font-medium text-ink-secondary transition-colors hover:bg-black/5 hover:text-ink"
          >
            {s.label}
          </a>
        ))}
        <Link
          to="/blog"
          className="rounded-[30px] px-3 py-1.5 text-[0.82rem] font-medium text-ink-secondary transition-colors hover:bg-black/5 hover:text-ink"
        >
          Writing
        </Link>
        <a
          href={'/#about'}
          onClick={goToSection('about')}
          className="rounded-[30px] px-3 py-1.5 text-[0.82rem] font-medium text-ink-secondary transition-colors hover:bg-black/5 hover:text-ink"
        >
          About
        </a>
      </div>

      <a
        href="https://instagram.com/tyothe3rd"
        target="_blank"
        rel="noreferrer"
        className="rounded-[30px] bg-black/[0.04] px-3 py-[5px] text-[0.78rem] text-ink-muted transition-colors hover:bg-[rgba(0,113,227,0.08)] hover:text-accent-blue"
      >
        @tyo ↗
      </a>
    </nav>
  )
}
