import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, TrendingUp, Clock, Heart, ShoppingCart } from 'lucide-react';

// Sample data for the home page
const featuredProducts = [
  {
    _id: '1',
    name: 'Classic Round Frames',
    image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 2499,
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
    isNew: false,
    discount: 15
  },
  {
    _id: '2',
    name: 'Modern Square Sunglasses',
    image: 'https://images.pexels.com/photos/701787/pexels-photo-701787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 3499,
    rating: 4.6,
    reviews: 98,
    isFeatured: true,
    isNew: true,
    discount: 0
  },
  {
    _id: '3',
    name: 'Ultra Thin Titanium Frames',
    image: 'https://images.pexels.com/photos/2080544/pexels-photo-2080544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 5999,
    rating: 4.9,
    reviews: 56,
    isFeatured: true,
    isNew: false,
    discount: 10
  },
  {
    _id: '4',
    name: 'Aviator Sunglasses',
    image: 'https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 2999,
    rating: 4.7,
    reviews: 87,
    isFeatured: true,
    isNew: true,
    discount: 0
  }
];

const trendingProducts = [
  {
    _id: '5',
    name: 'Cat Eye Tortoise Shell Frames',
    image: 'https://images.pexels.com/photos/2228561/pexels-photo-2228561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 1999,
    rating: 4.5,
    reviews: 64,
    isFeatured: false,
    isNew: false,
    discount: 0
  },
  {
    _id: '6',
    name: 'Premium Blue Light Glasses',
    image: 'https://images.pexels.com/photos/1054777/pexels-photo-1054777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 1799,
    rating: 4.3,
    reviews: 39,
    isFeatured: false,
    isNew: false,
    discount: 5
  },
  {
    _id: '7',
    name: 'Luxury Gold Rimmed Glasses',
    image: 'https://images.pexels.com/photos/2765871/pexels-photo-2765871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 7999,
    rating: 4.9,
    reviews: 28,
    isFeatured: false,
    isNew: true,
    discount: 0
  },
  {
    _id: '8',
    name: 'Sports Polarized Sunglasses',
    image: 'https://images.pexels.com/photos/2224699/pexels-photo-2224699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 3499,
    rating: 4.6,
    reviews: 52,
    isFeatured: false,
    isNew: false,
    discount: 0
  }
];

// Categories for the category section
const categories = [
  {
    name: 'Men\'s Eyeglasses',
    image: 'https://images.pexels.com/photos/2599705/pexels-photo-2599705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products?category=men'
  },
  {
    name: 'Women\'s Eyeglasses',
    image: 'https://images.pexels.com/photos/3727501/pexels-photo-3727501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products?category=women'
  },
  {
    name: 'Kids\' Eyeglasses',
    image: 'https://images.pexels.com/photos/3768163/pexels-photo-3768163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products?category=kids'
  },
  {
    name: 'Sunglasses',
    image: 'https://images.pexels.com/photos/1619660/pexels-photo-1619660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/products?type=sunglasses'
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero slider data
  const heroSlides = [
    {
      title: "Premium Eyewear Collection",
      subtitle: "Discover the perfect blend of style and clarity",
      image: "https://images.pexels.com/photos/1054777/pexels-photo-1054777.jpeg?auto=compress&cs=tinysrgb&w=1600",
      btnText: "Shop Now",
      btnLink: "/products",
      color: "from-primary-900/80 to-primary-900/90"
    },
    {
      title: "New Season Sunglasses",
      subtitle: "Protect your eyes with the latest UV protection technology",
      image: "https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=1600",
      btnText: "Explore Collection",
      btnLink: "/products?type=sunglasses",
      color: "from-gray-900/80 to-gray-900/90"
    },
    {
      title: "Free Eye Test",
      subtitle: "Book your comprehensive eye examination today",
      image: "https://images.pexels.com/photos/5752287/pexels-photo-5752287.jpeg?auto=compress&cs=tinysrgb&w=1600",
      btnText: "Book Appointment",
      btnLink: "/book-appointment",
      color: "from-primary-800/80 to-primary-900/90"
    }
  ];
  
  // Auto slide change for hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);
  
  // Function to format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}></div>
              <div className="absolute inset-0 flex items-center">
                <div className="container-custom">
                  <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-poppins">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8">{slide.subtitle}</p>
                    <Link
                      to={slide.btnLink}
                      className="btn btn-secondary inline-flex items-center"
                    >
                      {slide.btnText}
                      <ChevronRight size={18} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-secondary-500' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>
      
      {/* Category Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Browse Categories</h2>
            <p className="text-gray-600">Find the perfect eyewear for your style and needs</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-3 aspect-h-4 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-medium">{category.name}</h3>
                    <p className="text-white/90 text-sm mt-1 flex items-center">
                      Shop Now <ChevronRight size={16} className="ml-1" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Featured Products</h2>
              <p className="text-gray-600">Handpicked selection of our premium eyewear</p>
            </div>
            <Link to="/products" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card group">
                <div className="relative">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-img transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Product badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && <span className="badge badge-new">New</span>}
                    {product.discount > 0 && (
                      <span className="badge badge-sale">{product.discount}% OFF</span>
                    )}
                  </div>
                  
                  {/* Quick action buttons */}
                  <div className="absolute right-2 top-2 flex flex-col space-y-1">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart size={18} className="text-gray-600" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <ShoppingCart size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
                  </div>
                  
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-primary-700 transition-colors mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mt-1">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.price * (1 - product.discount / 100))}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <button className="mt-3 btn btn-primary w-full">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Banner */}
      <section className="py-12 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Genuine Products</h3>
              <p className="text-primary-100">100% authentic brands and products with warranty</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-primary-100">Quick processing and shipping across India</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Eye Test</h3>
              <p className="text-primary-100">Comprehensive eye examination by experts</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-primary-100">Multiple secure payment options available</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Trending Now</h2>
              <p className="text-gray-600">Our most popular products based on sales</p>
            </div>
            <div className="flex items-center">
              <TrendingUp size={20} className="text-primary-600 mr-2" />
              <Link to="/products?sort=trending" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                View All <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product._id} className="product-card group">
                <div className="relative">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-img transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Product badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && <span className="badge badge-new">New</span>}
                    {product.discount > 0 && (
                      <span className="badge badge-sale">{product.discount}% OFF</span>
                    )}
                    <span className="badge bg-primary-500 text-white">Trending</span>
                  </div>
                  
                  {/* Quick action buttons */}
                  <div className="absolute right-2 top-2 flex flex-col space-y-1">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart size={18} className="text-gray-600" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <ShoppingCart size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
                  </div>
                  
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-primary-700 transition-colors mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mt-1">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.price * (1 - product.discount / 100))}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <button className="mt-3 btn btn-primary w-full">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "The quality of the glasses I purchased is excellent. The staff was very helpful in
                helping me choose the right frame for my face shape. Highly recommend!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Rahul Sharma</h4>
                  <p className="text-sm text-gray-500">Chennai, Tamil Nadu</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "I've been coming to Sri Ragavendra Opticals for years. Their eye tests are thorough
                and the prices are reasonable. My go-to place for all my eyewear needs."
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Priya Patel</h4>
                  <p className="text-sm text-gray-500">Coimbatore, Tamil Nadu</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} />
              </div>
              <p className="text-gray-700 mb-4">
                "Fast delivery and great customer service. I ordered prescription sunglasses online
                and they arrived perfectly fit. Will definitely shop here again!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Customer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Vikram Singh</h4>
                  <p className="text-sm text-gray-500">Bangalore, Karnataka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Eye Care Tips Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Eye Care Tips</h2>
            <p className="text-gray-600">Learn how to keep your eyes healthy and vision clear</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tip 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://images.pexels.com/photos/5417675/pexels-photo-5417675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Eye Care Tip"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">The 20-20-20 Rule</h3>
                <p className="text-gray-700">
                  Every 20 minutes, look at something 20 feet away for 20 seconds. This helps reduce
                  digital eye strain when working on computers or smartphones.
                </p>
              </div>
            </div>
            
            {/* Tip 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://images.pexels.com/photos/39997/leopard-leopard-spots-animal-wild-39997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Eye Care Tip"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">Protect from UV Rays</h3>
                <p className="text-gray-700">
                  Always wear sunglasses that block 100% of UV-A and UV-B rays when outdoors, even
                  on cloudy days. UV protection is essential for eye health.
                </p>
              </div>
            </div>
            
            {/* Tip 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://images.pexels.com/photos/1105166/pexels-photo-1105166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Eye Care Tip"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">Balanced Diet for Vision</h3>
                <p className="text-gray-700">
                  Eat foods rich in omega-3 fatty acids, zinc, vitamins C and E, and lutein.
                  Nutrients like these can help prevent vision problems.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/eye-care-tips" className="btn btn-outline">
              View More Eye Care Tips
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA - Book Appointment */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 font-poppins">Schedule Your Eye Examination</h2>
              <p className="text-lg text-primary-100">
                Our experienced optometrists provide comprehensive eye tests to ensure your vision is
                at its best. Book your appointment today!
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/book-appointment" className="btn btn-secondary whitespace-nowrap">
                Book Appointment
              </Link>
              <Link to="/contact" className="btn btn-outline bg-transparent border-white text-white hover:bg-white/10 whitespace-nowrap">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Subscription */}
      <section className="py-12 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Stay Updated</h2>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter for the latest product updates, eye care tips, and
              exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="input flex-grow"
                required
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-3">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;