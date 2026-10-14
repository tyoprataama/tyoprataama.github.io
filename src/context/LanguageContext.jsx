import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('site-language') === 'id' ? 'id' : 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (nextLanguage) => {
    const next = nextLanguage === 'en' ? 'en' : 'id'
    setLanguageState(next)
    try {
      localStorage.setItem('site-language', next)
    } catch {
      // Language still works for the current session if storage is unavailable.
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}
