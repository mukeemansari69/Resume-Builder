import { useContext } from 'react'
import { AuthContext } from '../context/auth-context.js'

export const useAuth = () => {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  const { user, setUser, loading, isAuthenticated, login, register, logout, refreshSession } = auth

  return {
    user,
    setUser,
    loading,
    isAuthenticated,
    refreshSession,
    handleLogin: login,
    handleRegister: register,
    handleLogout: logout,
  }
}
