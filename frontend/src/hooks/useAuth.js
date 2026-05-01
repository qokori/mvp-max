import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import api from '../services/api.js'

export function useAuth() {
  const auth = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.user && localStorage.getItem('token')) {
      api.get('/auth/me')
        .then(({ data }) => {
          auth.login(data.user, localStorage.getItem('token'))
        })
        .catch(() => {
          auth.logout()
          localStorage.removeItem('token')
        })
    }
  }, [])

  const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.access_token)
    auth.login(data.user, data.access_token)
    return data
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    auth.logout()
    navigate('/login')
  }

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loginUser,
    logoutUser
  }
}