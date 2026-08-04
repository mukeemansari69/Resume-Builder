import { useCallback, useMemo, useState } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/context/AuthContext.jsx'
import { useAuth } from './features/auth/hooks/useAuth.js'

const AppShell = () => {
  const { user, loading, handleLogout } = useAuth()
  const [status, setStatus] = useState({ type: '', message: '' })

  const onLogout = useCallback(async () => {
    try {
      await handleLogout()
      setStatus({ type: 'success', message: 'You have been logged out.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Logout failed.' })
    }
  }, [handleLogout])

  const header = useMemo(() => {
    if (!user) {
      return null
    }

    return (
      <header className="app-shell-header">
        <div>
          <strong>{user.username}</strong>
          <div className="app-shell-subtitle">{user.email}</div>
        </div>
        <button type="button" onClick={onLogout} className="app-shell-logout">
          Logout
        </button>
      </header>
    )
  }, [onLogout, user])

  return (
    <>
      {loading ? <div className="app-shell-status">Loading your session...</div> : null}
      {header}
      {status.message ? (
        <div className={`app-shell-status ${status.type}`}>{status.message}</div>
      ) : null}
      <RouterProvider router={router} />
    </>
  )
}

const App = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
)

export default App
