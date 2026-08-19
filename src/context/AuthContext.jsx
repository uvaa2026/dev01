import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined = haven't checked yet, null = checked and signed out, object = signed in
  const [user, setUser] = useState(undefined)

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.me()
      setUser(data.respondent)
      return data.respondent
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // even if the request fails, drop the local session state
    }
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthLoading: user === undefined,
    isAuthenticated: Boolean(user),
    setUser,
    refreshUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
