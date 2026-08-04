const AUTH_BASE_URL = '/api/auth'
const AUTH_STORAGE_KEY = 'resume_builder_user'

const emitAuthUpdate = (user) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent('auth:updated', { detail: user || null }))
}

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage)
  }

  return data
}

const authRequest = async (endpoint, options = {}, fallbackMessage) => {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  return parseResponse(response, fallbackMessage)
}

const saveAuthUser = (user) => {
  if (!user) {
    clearAuthUser()
    return null
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  emitAuthUpdate(user)
  return user
}

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  emitAuthUpdate(null)
}

export const getStoredAuthUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export async function registerUser({ username, email, password }) {
  const data = await authRequest(
    '/register',
    {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    },
    'Registration failed. Please try again.',
  )

  saveAuthUser(data.user)
  return data
}

export async function loginUser({ email, password }) {
  const data = await authRequest(
    '/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    },
    'Login failed. Please try again.',
  )

  saveAuthUser(data.user)
  return data
}

export async function logoutUser() {
  const data = await authRequest(
    '/logout',
    { method: 'POST' },
    'Logout failed. Please try again.',
  )

  clearAuthUser()
  return data
}

export async function getMe() {
  try {
    const data = await authRequest(
      '/get-me',
      { method: 'GET' },
      'Unable to load your account right now.',
    )

    if (data?.user) {
      saveAuthUser(data.user)
    }

    return data
  } catch (error) {
    clearAuthUser()
    throw error
  }
}

export { AUTH_STORAGE_KEY, saveAuthUser }
