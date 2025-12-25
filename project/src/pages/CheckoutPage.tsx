import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Truck, Shield, AlertCircle } from 'lucide-react';

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: user?.phone || ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'CreditCard',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card'
    },
    {
      id: 'NetBanking',
      name: 'Net Banking',
      description: 'Pay using your bank account'
    },
    {
      id: 'UPI',
      name: 'UPI',
      description: 'Pay using UPI apps'
    },
    {
      id: 'Wallet',
      name: 'Digital Wallet',
      description: 'Pay using digital wallets'
    },
    {
      id: 'COD',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order'
    }
  ];
  
  // Calculate order summary
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cart.items.length, navigate]);
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = {
        orderItems: cart.items,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      
      // Clear cart and redirect to order confirmation
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-4 ${
                step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-4 ${
                step >= 3 ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">Shipping</span>
              <span className="text-sm font-medium">Payment</span>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
          
          {/* Shipping Address Form */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <form onSubmit={handleShippingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button type="submit" className="btn btn-primary w-full">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Payment Method Selection */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                        required
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Continue to Review
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Order Review */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold mb-6">Review Order</h2>
              
              {/* Shipping Address Review */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">{shippingAddress.name}</p>
                  <p className="text-gray-600">{shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{shippingAddress.phone}</p>
                </div>
              </div>
              
              {/* Payment Method Review */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item._id} className="py-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-gray-900 font-medium">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {error && (
                <div className="mb-6 bg-error-50 text-error-900 p-4 rounded-md flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  {error}
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
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
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-gray-600">
                <Shield size={20} className="text-primary-600 mr-2" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Truck size={20} className="text-primary-600 mr-2" />
                <span className="text-sm">Free Shipping above ₹2,000</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CreditCard size={20} className="text-primary-600 mr-2" />
                <span className="text-sm">Multiple Payment Options</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;