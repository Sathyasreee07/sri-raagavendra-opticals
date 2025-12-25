import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  AlertCircle,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
  product: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: string;
  trackingNumber?: string;
  createdAt: string;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchOrder();
  }, [id]);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="container-custom py-12">
        <div className="bg-error-50 text-error-900 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <Link to="/orders" className="text-primary-600 hover:text-primary-800 flex items-center">
          <ChevronLeft size={20} className="mr-1" />
          Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                getStatusColor(order.status)
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Order Progress */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.isPaid ? 'bg-success-500 text-white' : 'bg-gray-200'
              }`}>
                <CreditCard size={20} />
              </div>
              <span className="mt-2 text-sm font-medium">Payment</span>
              {order.isPaid && (
                <span className="text-xs text-gray-500">
                  {new Date(order.paidAt!).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${
                order.status === 'Processing' ? 'bg-primary-500' : 'bg-gray-200'
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.status === 'Shipped' || order.status === 'Delivered'
                  ? 'bg-success-500 text-white'
                  : 'bg-gray-200'
              }`}>
                <Package size={20} />
              </div>
              <span className="mt-2 text-sm font-medium">Processing</span>
            </div>
            
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${
                order.status === 'Shipped' ? 'bg-primary-500' : 'bg-gray-200'
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.isDelivered ? 'bg-success-500 text-white' : 'bg-gray-200'
              }`}>
                <Truck size={20} />
              </div>
              <span className="mt-2 text-sm font-medium">Delivered</span>
              {order.isDelivered && (
                <span className="text-xs text-gray-500">
                  {new Date(order.deliveredAt!).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <Link
                        to={`/products/${item.product}`}
                        className="text-gray-900 font-medium hover:text-primary-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-600">
                        {item.quantity} x ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Info */}
            <div>
              {/* Shipping Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard size={18} className="mr-2 text-gray-500" />
                  Payment Information
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Method: {order.paymentMethod}</p>
                  <p>Status: {order.isPaid ? 'Paid' : 'Pending'}</p>
                  {order.isPaid && order.paidAt && (
                    <p>Paid on: {new Date(order.paidAt).toLocaleDateString()}</p>
                  )}
                  {order.paymentResult && (
                    <div className="mt-2">
                      <p>Transaction ID: {order.paymentResult.id}</p>
                      <p>Status: {order.paymentResult.status}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Truck size={18} className="mr-2 text-gray-500" />
                    Tracking Information
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>Tracking Number: {order.trackingNumber}</p>
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-800 flex items-center mt-2"
                    >
                      Track Package
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;