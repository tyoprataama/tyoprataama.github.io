import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Persistent shell: masthead + routed page + footer.
export default function RootLayout() {
  const location = useLocation()
  const {
    language
  } = useLanguage()

  useEffect(() => {
    const pathname = location.pathname
    let title

    if (pathname === '/admin' || pathname.endsWith('/admin')) {
      title = 'Admin | Tyo Putra'
    } else if (pathname.endsWith('/blog')) {
      title = language === 'id' ?
        'Tulisan | Tyo Putra' :
        'Writing | Tyo Putra'
    } else if (pathname.includes('/blog/')) {
      title = 'Tyo Putra'
    } else if (
      pathname === '/' ||
      pathname ===
      import.meta.env.BASE_URL
    ) {
      title = language === 'id' ?
        'Tyo Putra — Ahli K3 Umum | Data & Operasional' :
        'Tyo Putra — Occupational Safety Health & Environment | Data & Operations'
    } else {
      title = 'Tyo Putra'
    }

    document.title = title
  }, [location.pathname, language])

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
