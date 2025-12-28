import { create } from 'zustand'
import api from '../lib/axios'
import toast from 'react-hot-toast'

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart')
      set({ cart: data.cart })
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/cart/items', { productId, quantity })
      set({ cart: data.cart, loading: false })
      toast.success('Added to cart')
    } catch (error) {
      set({ loading: false })
      const message = error.response?.data?.message || 'Failed to add to cart'
      toast.error(message)
      throw error
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${productId}`, { quantity })
      set({ cart: data.cart })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart'
      toast.error(message)
      throw error
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`)
      set({ cart: data.cart })
      toast.success('Removed from cart')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item'
      toast.error(message)
      throw error
    }
  },

  clearCart: async () => {
    try {
      const { data } = await api.delete('/cart')
      set({ cart: data.cart })
      toast.success('Cart cleared')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      toast.error(message)
      throw error
    }
  },

  getCartCount: () => {
    const { cart } = get()
    return cart?.totalItems || 0
  },
}))
