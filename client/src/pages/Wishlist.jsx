import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatPrice } from '../lib/utils'
import { useCartStore } from '../store/cartStore'
import api from '../lib/axios'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCartStore()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/users/wishlist/items')
      setWishlist(data.wishlist)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`)
      setWishlist(wishlist.filter(item => item._id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
    } catch (error) {
      // Error handled in store
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love for later!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>

              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-lg font-bold text-gray-900 mb-3">
                  {formatPrice(product.price)}
                </p>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.stock === 0}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
