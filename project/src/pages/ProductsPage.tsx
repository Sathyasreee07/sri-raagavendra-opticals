import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List, ChevronDown, Search, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
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
    frameMaterial: string;
    color: string;
    shape: string;
    gender: string;
  };
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    brand: '',
    gender: '',
    priceRange: '',
    frameMaterial: '',
    color: '',
    shape: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get query params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters(prev => ({
      ...prev,
      category: params.get('category') || '',
      type: params.get('type') || ''
    }));
    setSearchQuery(params.get('search') || '');
  }, [location.search]);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        if (searchQuery) queryParams.append('search', searchQuery);
        queryParams.append('sortBy', sortBy);
        
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
        
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortBy, searchQuery]);
  
  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      brand: '',
      gender: '',
      priceRange: '',
      frameMaterial: '',
      color: '',
      shape: ''
    });
    setSortBy('newest');
    navigate('/products');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    navigate(`/products?${params.toString()}`);
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
        <div className="bg-error-50 text-error-900 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
            {filters.category
              ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Eyewear`
              : filters.type
              ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}`
              : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {products.length} products available
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input pr-10 appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rating</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${
                view === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${
                view === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input pl-10 pr-4"
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>
      
      {/* Active Filters */}
      {Object.values(filters).some(Boolean) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <span
                key={key}
                className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {key}: {value}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`lg:w-64 bg-white p-6 rounded-lg shadow-card ${
            showFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X size={20} />
            </button>
          </div>
          
          {/* Filter sections */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {['men', 'women', 'kids'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <h3 className="font-medium mb-3">Type</h3>
              <div className="space-y-2">
                {['eyeglasses', 'sunglasses', 'contact-lenses', 'accessories'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { label: 'Under ₹1,000', value: '0-1000' },
                  { label: '₹1,000 - ₹2,500', value: '1000-2500' },
                  { label: '₹2,500 - ₹5,000', value: '2500-5000' },
                  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
                  { label: 'Above ₹10,000', value: '10000-' }
                ].map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Frame Material Filter */}
            <div>
              <h3 className="font-medium mb-3">Frame Material</h3>
              <div className="space-y-2">
                {['Metal', 'Acetate', 'TR-90', 'Titanium'].map(material => (
                  <label key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.frameMaterial === material}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        frameMaterial: e.target.checked ? material : ''
                      }))}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span className="ml-2 text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Shape Filter */}
            <div>
              <h3 className="font-medium mb-3">Shape</h3>
              <div className="space-y-2">
                {['Round', 'Square', 'Rectangle', 'Oval', 'Cat Eye'].map(shape => (
                  <label key={shape} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.shape === shape}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        shape: e.target.checked ? shape : ''
                      }))}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span className="ml-2 text-gray-700">{shape}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 btn btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${
              view === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6`}>
              {products.map(product => (
                <div
                  key={product._id}
                  className={`bg-white rounded-lg shadow-card overflow-hidden ${
                    view === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${view === 'list' ? 'w-48' : ''}`}>
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      className="w-full h-48 object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 text-xs rounded">
                        New
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-error-500 text-white px-2 py-1 text-xs rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className={`p-4 ${view === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">
                          ({product.numReviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {view === 'list' && (
                        <div className="flex space-x-2">
                          <button className="btn btn-primary">Add to Cart</button>
                          <button className="btn btn-outline">View Details</button>
                        </div>
                      )}
                    </div>
                    
                    {view === 'grid' && (
                      <button className="mt-4 w-full btn btn-primary">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;