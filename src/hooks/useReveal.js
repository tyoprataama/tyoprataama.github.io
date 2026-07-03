import {
  useEffect
} from 'react'

// Adds `.in` to every `.sr` (scroll-reveal) element as it enters the viewport,
// and keeps `.reveal`/`.visible` working for any legacy markup.
export default function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.sr, .reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(entry.target.classList.contains('sr') ? 'in' : 'visible')
            observer.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
