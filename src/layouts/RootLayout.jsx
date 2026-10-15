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
    document.documentElement.lang = language === 'id' ? 'id' : 'en'
    const pathname = location.pathname
    let title

    if (pathname === '/admin' || pathname.endsWith('/admin')) {
      title = 'Admin | Tyo Pratama Priyanto Putra'
    } else if (pathname.endsWith('/blog')) {
      title = language === 'id' ?
        'Tulisan | Tyo Pratama Priyanto Putra' :
        'Writing | Tyo Pratama Priyanto Putra'
    } else if (pathname.includes('/blog/')) {
      title = 'Tyo Pratama Priyanto Putra'
    
    } else if (
      pathname === '/' ||
      pathname === import.meta.env.BASE_URL
    ) {
      title = language === 'id'
        ? 'Tyo Pratama Priyanto Putra | Ahli K3 Umum, Data & Operasional'
        : 'Tyo Pratama Priyanto Putra | Occupational Safety, Data & Operations'
    }


    document.title = title

    const isArticleRoute = pathname.includes('/blog/')
    const canonicalUrl = isArticleRoute
      ? `https://tyoprataama.github.io${pathname}`
      : pathname.endsWith('/blog')
        ? 'https://tyoprataama.github.io/blog'
        : 'https://tyoprataama.github.io/'
    const descriptions = {
      home: language === 'id'
        ? 'Tyo Pratama Priyanto Putra — profesional di bidang K3, analisis data, dan operasional. Lihat profil, pengalaman, proyek, dan tulisan.'
        : 'Tyo Pratama Priyanto Putra — professional in occupational safety, data analysis, and operations. Explore profile, experience, projects, and writing.',
      blog: language === 'id'
        ? 'Tulisan Tyo Pratama Priyanto Putra tentang K3, data, teknologi, dan operasional.'
        : 'Articles by Tyo Pratama Priyanto Putra about occupational safety, data, technology, and operations.'
    }
    const description = isArticleRoute ? '' : pathname.endsWith('/blog') ? descriptions.blog : descriptions.home
    const setMeta = (name, value, attr = 'name') => {
      let element = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', value)
    }
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
    if (description) {
      setMeta('description', description)
      setMeta('og:title', title, 'property')
      setMeta('og:description', description, 'property')
      setMeta('og:url', canonicalUrl, 'property')
    }
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
