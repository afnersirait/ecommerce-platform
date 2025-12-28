import { create } from 'zustand'
import api from '../lib/axios'

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  featuredProducts: [],
  categories: [],
  loading: false,
  pagination: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true })
    try {
      const { data } = await api.get('/products', { params })
      set({ 
        products: data.products, 
        pagination: data.pagination,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      console.error('Failed to fetch products:', error)
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true })
    try {
      const { data } = await api.get(`/products/${id}`)
      set({ product: data.product, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error('Failed to fetch product:', error)
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const { data } = await api.get('/products/featured')
      set({ featuredProducts: data.products })
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await api.get('/categories')
      set({ categories: data.categories })
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  },

  addReview: async (productId, reviewData) => {
    try {
      await api.post(`/products/${productId}/reviews`, reviewData)
      // Refresh product data
      const { data } = await api.get(`/products/${productId}`)
      set({ product: data.product })
    } catch (error) {
      throw error
    }
  },
}))
