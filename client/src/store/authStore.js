import { create } from 'zustand'
import api from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,

  loadUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }

    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.user, isAuthenticated: true })
    } catch (error) {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  login: async (credentials) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/login', credentials)
      localStorage.setItem('token', data.token)
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        loading: false 
      })
      toast.success('Login successful!')
      return data
    } catch (error) {
      set({ loading: false })
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  },

  register: async (userData) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/register', userData)
      localStorage.setItem('token', data.token)
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        loading: false 
      })
      toast.success('Registration successful!')
      return data
    } catch (error) {
      set({ loading: false })
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
    toast.success('Logged out successfully')
  },

  updateProfile: async (userData) => {
    try {
      const { data } = await api.put('/auth/update-profile', userData)
      set({ user: data.user })
      toast.success('Profile updated successfully')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      throw error
    }
  },
}))
