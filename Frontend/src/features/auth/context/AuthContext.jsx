import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import { clearAuthUser, getMe, getStoredAuthUser, loginUser, logoutUser, registerUser, saveAuthUser } from '../services/auth.api.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuthUser())
  const [loading, setLoading] = useState(Boolean(getStoredAuthUser()))

  const syncUser = useCallback((nextUser) => {
    setUser(nextUser)

    if (nextUser) {
      saveAuthUser(nextUser)
    } else {
      clearAuthUser()
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const storedUser = getStoredAuthUser()

    if (!storedUser) {
      setUser(null)
      setLoading(false)
      return null
    }

    try {
      setLoading(true)
      const response = await getMe()
      const nextUser = response?.user || storedUser
      syncUser(nextUser)
      return nextUser
    } catch (error) {
      syncUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [syncUser])

  const login = useCallback(async (payload) => {
    try {
      setLoading(true)
      const response = await loginUser(payload)
      const nextUser = response?.user || null
      syncUser(nextUser)
      return response
    } finally {
      setLoading(false)
    }
  }, [syncUser])

  const register = useCallback(async (payload) => {
    try {
      setLoading(true)
      const response = await registerUser(payload)
      const nextUser = response?.user || null
      syncUser(nextUser)
      return response
    } finally {
      setLoading(false)
    }
  }, [syncUser])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await logoutUser()
      syncUser(null)
    } finally {
      setLoading(false)
    }
  }, [syncUser])

  useEffect(() => {
    let isMounted = true
    const storedUser = getStoredAuthUser()

    if (!storedUser) {
      return () => {
        isMounted = false
      }
    }

    const verifySession = async () => {
      try {
        const response = await getMe()

        if (isMounted) {
          syncUser(response?.user || storedUser)
        }
      } catch {
        if (isMounted) {
          syncUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [syncUser])

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    setUser: syncUser,
    refreshSession,
    login,
    register,
    logout,
  }), [user, loading, syncUser, refreshSession, login, register, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
