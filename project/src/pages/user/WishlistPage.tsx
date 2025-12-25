import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  brand: string;
  stock: number;
  discount: number;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setWishlist(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);
  
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      _id: item._id,
      name: item.name,
      image: item.images[0].url,
      price: item.price * (1 - item.discount / 100),
      quantity: 1
    });
    handleRemoveFromWishlist(item._id);
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
  
  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-error-50 text-error-900 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">
            Add items to your wishlist to keep track of products you love.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-poppins">My Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="relative">
              <Link to={`/products/${item._id}`}>
                <img
                  src={item.images[0].url}
                  alt={item.images[0].alt}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              {item.discount > 0 && (
                <span className="absolute top-2 left-2 bg-error-500 text-white px-2 py-1 text-xs rounded">
                  {item.discount}% OFF
                </span>
              )}
              
              <button
                onClick={() => handleRemoveFromWishlist(item._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={18} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-4">
              <Link
                to={`/products/${item._id}`}
                className="text-gray-900 font-medium hover:text-primary-600"
              >
                {item.name}
              </Link>
              
              <p className="text-gray-600 text-sm mt-1">{item.brand}</p>
              
              <div className="mt-2">
                {item.discount > 0 ? (
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{(item.price * (1 - item.discount / 100)).toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;