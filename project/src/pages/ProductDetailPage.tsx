import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, ChevronRight, ChevronLeft, Check, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; alt: string }[];
  brand: string;
  category: string;
  type: string;
  rating: number;
  numReviews: number;
  stock: number;
  isNew: boolean;
  discount: number;
  specifications: {
    frameWidth: string;
    frameHeight: string;
    templeLength: string;
    bridgeWidth: string;
    frameMaterial: string;
    lensMaterial: string;
    weight: string;
    color: string;
    shape: string;
    gender: string;
  };
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch product');
        
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock));
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    try {
      setAddingToCart(true);
      
      // Add to cart
      addItem({
        _id: product._id,
        name: product.name,
        image: product.images[0].url,
        price: product.price * (1 - product.discount / 100),
        quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } catch (err) {
      console.log('Error sharing:', err);
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
  
  if (error || !product) {
    return (
      <div className="container-custom py-12">
        <div className="bg-error-50 text-error-900 p-4 rounded-md">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-primary-600">Home</a>
        <ChevronRight size={16} className="mx-2" />
        <a href="/products" className="hover:text-primary-600">Products</a>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedImage(prev =>
                    prev === product.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary-600 text-white px-3 py-1 text-sm rounded-full">
                  New
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-error-500 text-white px-3 py-1 text-sm rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>
          
          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? 'ring-2 ring-primary-600'
                      : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="ml-3 text-error-600">
                    Save {product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-success-600">
                  <Check size={20} className="mr-2" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-error-600">
                  <Info size={20} className="mr-2" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-4 text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 text-center border-x border-gray-300 py-2"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="btn btn-primary flex-1 flex items-center justify-center"
                >
                  {addingToCart ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Adding...
                    </span>
                  ) : addedToCart ? (
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      Added to Cart
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </span>
                  )}
                </button>
                
                <button className="btn btn-outline p-4">
                  <Heart size={20} />
                </button>
                
                <button onClick={handleShare} className="btn btn-outline p-4">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Product Description */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Specifications */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Products */}
      {/* This section would be implemented with actual product recommendations */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        {/* Add similar products grid here */}
      </div>
    </div>
  );
};

export default ProductDetailPage;