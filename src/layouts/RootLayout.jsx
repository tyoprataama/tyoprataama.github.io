import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BackgroundBlobs from '../components/BackgroundBlobs.jsx'

// Single persistent shell: BackgroundBlobs + Navbar + <Outlet/> + Footer.
// The <Outlet/> renders whichever child route is active, so the Navbar and
// Footer never unmount between navigations.
export default function RootLayout() {
  const location = useLocation()

  // Scroll to top on route change, or to the hash target when present.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        // Defer until the page has painted.
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <BackgroundBlobs />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
