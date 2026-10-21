
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Persistent shell: masthead + routed page + footer.
export default function RootLayout() {
  const location = useLocation()
  const { language } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language === 'id' ? 'id' : 'en'

    const pathname = location.pathname
    const isId = language === 'id'

    const titles = {
      home: isId
        ? 'Tyo Pratama Priyanto Putra | Ahli K3 Umum, Data & Operasional'
        : 'Tyo Pratama Priyanto Putra | Occupational Safety, Data & Operations',

      admin: 'Admin | Tyo Pratama Priyanto Putra',

      blog: isId
        ? 'Tulisan | Tyo Pratama Priyanto Putra'
        : 'Writing | Tyo Pratama Priyanto Putra',

      article: 'Tyo Pratama Priyanto Putra',

      notFound: isId
        ? '404 — Halaman Tidak Ditemukan | Tyo Pratama Priyanto Putra'
        : '404 — Page Not Found | Tyo Pratama Priyanto Putra',
    }

    const routes = [
      {
        match: path =>
          path === '/' || path === import.meta.env.BASE_URL,
        title: titles.home,
        page: 'home',
      },
      {
        match: path =>
          path === '/admin' || path === '/admin/' || path.endsWith('/admin'),
        title: titles.admin,
        page: 'admin',
      },
      {
        match: path => path.endsWith('/blog'),
        title: titles.blog,
        page: 'blog',
      },
      {
        match: path => path.includes('/blog/'),
        title: titles.article,
        page: 'article',
      },
    ]

    const matchedRoute = routes.find(route =>
      route.match(pathname)
    )

    const title = matchedRoute?.title ?? titles.notFound
    const page = matchedRoute?.page ?? 'notFound'

    document.title = title

    const canonicalUrl = page === 'article'
      ? `https://tyoprataama.github.io${pathname}`
      : page === 'blog'
        ? 'https://tyoprataama.github.io/blog'
        : page === 'home'
          ? 'https://tyoprataama.github.io/'
          : `https://tyoprataama.github.io${pathname}`

    const descriptions = {
      home: isId
        ? 'Tyo Pratama Priyanto Putra — profesional di bidang K3, analisis data, dan operasional. Lihat profil, pengalaman, proyek, dan tulisan.'
        : 'Tyo Pratama Priyanto Putra — professional in occupational safety, data analysis, and operations. Explore profile, experience, projects, and writing.',

      blog: isId
        ? 'Tulisan Tyo Pratama Priyanto Putra tentang K3, data, teknologi, dan operasional.'
        : 'Articles by Tyo Pratama Priyanto Putra about occupational safety, data, technology, and operations.',
    }

    const description = descriptions[page] ?? ''

    const setMeta = (name, value, attr = 'name') => {
      let element = document.head.querySelector(
        `meta[${attr}="${name}"]`
      )

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', value)
    }

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    )

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
      const el = document.getElementById(
        location.hash.slice(1)
      )

      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: 'smooth' }),
          50
        )
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
