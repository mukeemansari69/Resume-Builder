import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { loginUser, logoutUser, registerUser } from '../services/auth.api.js'

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext)

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true)
      const data = await loginUser({ email, password })
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true)
      const data = await registerUser({ username, email, password })
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logoutUser()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    setUser,
    loading,
    setLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  }
}