import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  const logout = () => supabase.auth.signOut()

  return (
  <AuthContext.Provider value= {{isAuthed: !!session, loading, login, logout}} >
    {children}
  </AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext)