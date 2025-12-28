import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../lib/utils'
import Loading from '../components/Loading'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  if (loading && !cart) {
    return <Loading fullScreen />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(productId, newQuantity)
    } catch (error) {
      // Error handled in store
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      // Error handled in store
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-6 border-b last:border-b-0"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.product._id}`}
                    className="w-24 h-24 flex-shrink-0"
                  >
                    <img
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/100'}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="font-semibold text-gray-900 hover:text-primary-600 mb-1 block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.product.category?.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 mb-2">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{cart.totalPrice > 100 ? 'FREE' : formatPrice(10)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(cart.totalPrice * 0.1)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        cart.totalPrice +
                        (cart.totalPrice > 100 ? 0 : 10) +
                        cart.totalPrice * 0.1
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn btn-primary mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
