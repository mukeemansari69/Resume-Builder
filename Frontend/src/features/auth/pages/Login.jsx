import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

const initialForm = {
  email: '',
  password: '',
}

const Login = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const { handleLogin, loading } = useAuth()

  const canSubmit = useMemo(
    () => form.email.trim() && form.password.trim() && !loading,
    [form.email, form.password, loading],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: 'error', message: 'Email and password are required.' })
      return
    }

    try {
      const data = await handleLogin({
        email: form.email.trim(),
        password: form.password,
      })

      setStatus({ type: 'success', message: data.message || 'User logged in successfully.' })
      setForm(initialForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-stage" aria-label="Login workspace">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <aside className="auth-showcase">
          <div className="brand-mark">RB</div>
          <p className="eyebrow">Resume Builder</p>
          <h1>Welcome back to your career cockpit.</h1>
          <p className="showcase-copy">
            Sign in and keep every resume draft, profile detail, and polished export ready for the next opportunity.
          </p>

          <div className="orbit-system" aria-hidden="true">
            <span className="orbit orbit-a"><i /></span>
            <span className="orbit orbit-b"><i /></span>
            <span className="orbit orbit-c"><i /></span>
            <div className="resume-preview">
              <span />
              <span />
              <span />
              <strong />
            </div>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="panel-glow" />
          <div className="auth-panel-inner">
            <div className="form-heading">
              <p className="eyebrow">Secure Login</p>
              <h2>Log in</h2>
              <p>Use the same email and password registered with the backend.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field-group">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="field-group">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </label>

              {status.message ? (
                <p className={`auth-message ${status.type}`} role="status">
                  {status.message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={!canSubmit}>
                <span>{loading ? 'Signing in' : 'Sign in'}</span>
                <i aria-hidden="true" />
                {loading ? <span className="auth-submit-spinner" aria-hidden="true" /> : null}
              </button>
            </form>

            <p className="switch-auth">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Login
