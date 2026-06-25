import { createContext, useContext, useEffect, useState } from 'react'

// ──────────────────────────────────────────────────────────────
// DEMO-ONLY client-side auth.
//
// GitHub Pages is static hosting — there is no server to verify a password.
// This gate only protects the /admin UI in the browser and is NOT real security.
// For a real admin you'd add a backend / auth provider (e.g. Supabase, Firebase,
// Auth0) and verify server-side. Credentials below are intentionally obvious.
// ──────────────────────────────────────────────────────────────
const DEMO_USER = 'admin'
const DEMO_PASS = 'admin123'
const STORAGE_KEY = 'tyo-admin-auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === '1',
  )

  useEffect(() => {
    if (isAuthed) sessionStorage.setItem(STORAGE_KEY, '1')
    else sessionStorage.removeItem(STORAGE_KEY)
  }, [isAuthed])

  const login = (user, pass) => {
    if (user === DEMO_USER && pass === DEMO_PASS) {
      setIsAuthed(true)
      return { ok: true }
    }
    return { ok: false, error: 'Username atau password salah.' }
  }
  const logout = () => setIsAuthed(false)

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout, demo: { user: DEMO_USER, pass: DEMO_PASS } }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
