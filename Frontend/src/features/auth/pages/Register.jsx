import { useMemo, useState } from 'react'
import { Link } from 'react-router'

const initialForm = {
  username: '',
  email: '',
  password: '',
}

const Register = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(
    () => form.username.trim() && form.email.trim() && form.password.trim() && !isSubmitting,
    [form.username, form.email, form.password, isSubmitting],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setStatus({ type: 'error', message: 'Username, email, and password are required.' })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.')
      }

      localStorage.setItem('resume_builder_user', JSON.stringify(data.user))
      setStatus({ type: 'success', message: data.message || 'User registered successfully.' })
      setForm(initialForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-stage" aria-label="Registration workspace">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <aside className="auth-showcase">
          <div className="brand-mark">RB</div>
          <p className="eyebrow">Resume Builder</p>
          <h1>Start with a profile that already feels sharp.</h1>
          <p className="showcase-copy">
            Create your account and unlock a focused workspace for writing cleaner resumes without visual noise.
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
              <p className="eyebrow">Create Account</p>
              <h2>Register</h2>
              <p>Backend requires a unique username, unique email, and password.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field-group">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </label>

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </label>

              {status.message ? (
                <p className={`auth-message ${status.type}`} role="status">
                  {status.message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={!canSubmit}>
                <span>{isSubmitting ? 'Creating account' : 'Create account'}</span>
                <i aria-hidden="true" />
              </button>
            </form>

            <p className="switch-auth">
              Already registered? <Link to="/login">Log in</Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Register
