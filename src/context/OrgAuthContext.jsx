import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const OrgAuthContext = createContext(null)

// Separate from AuthContext (respondents) on purpose: an Org Admin who
// declined to take the assessment themselves has no respondent row at all,
// so their session can't be represented by useAuth()'s `user`. This
// context tracks that OTHER kind of session — direct Org Admin login
// (POST /org/login) — via GET /org/me, which only resolves for that kind
// of session. An Org Admin who DID opt in and also has a respondent
// session shows up in useAuth() instead (as user.isOrgAdminOf); the two
// contexts are deliberately independent, and OrgAdminRoute checks both.
export function OrgAuthProvider({ children }) {
  const [orgAdmin, setOrgAdmin] = useState(undefined) // undefined = checking, null = not this kind of session, object = signed in

  const refreshOrgAdmin = useCallback(async () => {
    try {
      const data = await api.orgMe()
      setOrgAdmin(data.orgAdmin)
      return data.orgAdmin
    } catch {
      setOrgAdmin(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshOrgAdmin()
  }, [refreshOrgAdmin])

  const clearOrgAdmin = useCallback(() => setOrgAdmin(null), [])

  const value = {
    orgAdmin,
    isOrgAuthLoading: orgAdmin === undefined,
    isOrgAuthenticated: Boolean(orgAdmin),
    refreshOrgAdmin,
    clearOrgAdmin,
  }

  return <OrgAuthContext.Provider value={value}>{children}</OrgAuthContext.Provider>
}

export function useOrgAuth() {
  const ctx = useContext(OrgAuthContext)
  if (!ctx) throw new Error('useOrgAuth must be used within an OrgAuthProvider')
  return ctx
}
