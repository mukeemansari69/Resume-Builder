import axios from 'axios'

const AUTH_STORAGE_KEY = 'resume_builder_user'

const authApi = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
})

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback
}

const saveAuthUser = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:updated'))
    }
    return null
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:updated', { detail: user }))
  }

  return user
}

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:updated'))
  }
}

export const getStoredAuthUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export async function registerUser(payload) {
  try {
    const { data } = await authApi.post('/register', payload)
    saveAuthUser(data.user)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Registration failed. Please try again.'), { cause: error })
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await authApi.post('/login', payload)
    saveAuthUser(data.user)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Login failed. Please try again.'), { cause: error })
  }
}

export async function logoutUser() {
  try {
    const { data } = await authApi.post('/logout')
    clearAuthUser()
    return data
  } catch (error) {
    clearAuthUser()
    throw new Error(getErrorMessage(error, 'Logout failed. Please try again.'), { cause: error })
  }
}

export async function getMe() {
  try {
    const { data } = await authApi.get('/get-me')
    if (data?.user) {
      saveAuthUser(data.user)
    }
    return data
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      clearAuthUser()
    }
    throw new Error(getErrorMessage(error, 'Unable to load your account right now.'), { cause: error })
  }
}

export { AUTH_STORAGE_KEY, saveAuthUser }