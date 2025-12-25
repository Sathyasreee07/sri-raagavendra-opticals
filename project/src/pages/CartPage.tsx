import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };
  
  // Calculate order summary
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  if (cart.items.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-poppins">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center p-6 border-b border-gray-200 last:border-0"
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 ml-6">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Unit Price: ₹{item.price}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Subtotal and Remove Button */}
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900 mr-4">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-error-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  Free shipping on orders above ₹2,000
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-full mt-6 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Proceed to Checkout
                  <ArrowRight size={20} className="ml-2" />
                </span>
              )}
            </button>
            
            <Link
              to="/products"
              className="btn btn-outline w-full mt-4 flex items-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-6 bg-white rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">We Accept</h3>
            <div className="flex space-x-2">
              {/* <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=VISA" alt="Visa" className="h-6" />
              <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=MC" alt="MasterCard" className="h-6" />
              <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=AMEX" alt="Amex" className="h-6" />
              <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=PAYTM" alt="Paytm" className="h-6" />
              <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=UPI" alt="UPI" className="h-6" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;