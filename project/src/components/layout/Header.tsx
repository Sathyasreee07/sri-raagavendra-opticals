import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  Search,
  Glasses,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);
  
  // Handle scroll event to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleCategoriesMenu = () => setCategoriesOpen(!categoriesOpen);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      {/* Top bar - contains contact info, account links */}
      <div className="bg-primary-900 text-white py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="text-sm">
            <span className="mr-4">Call us: +91 98765 43210</span>
            <span>Email: contact@sriragavendraopticals.com</span>
          </div>
          <div className="flex space-x-4 text-sm">
            <Link to="/book-appointment" className="hover:text-secondary-300">Book an Eye Test</Link>
            <Link to="/about" className="hover:text-secondary-300">About Us</Link>
            <Link to="/contact" className="hover:text-secondary-300">Contact</Link>
          </div>
        </div>
      </div>
      
      {/* Main header - contains logo, search, navigation */}
      <div className="py-4 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-10 w-auto" />
                <span className="ml-2 text-xl font-poppins font-bold text-primary-900 hidden sm:block">
                  Sri Ragavendra<span className="text-secondary-500">Opticals</span>
                </span>
              </Link>
            </div>
            
            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="input pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600">
                  <Search size={20} />
                </button>
              </div>
            </div>
            
            {/* Nav icons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none"
                  >
                    <User size={24} />
                    <span className="hidden md:block ml-1">{user?.name?.split(' ')[0]}</span>
                  </button>
                  
                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Wishlist
                      </Link>
                      <button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-gray-700 hover:text-primary-600">
                  <User size={24} />
                  <span className="hidden md:block ml-1">Login</span>
                </Link>
              )}
              
              <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-primary-600">
                <Heart size={24} />
                <span className="hidden md:block ml-1">Wishlist</span>
              </Link>
              
              <Link to="/cart" className="flex items-center text-gray-700 hover:text-primary-600 relative">
                <ShoppingCart size={24} />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
                <span className="hidden md:block ml-1">Cart</span>
              </Link>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none" 
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 hidden md:block">
        <div className="container-custom">
          <ul className="flex space-x-8 py-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
            </li>
            <li className="relative group">
              <button 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium"
                onClick={toggleCategoriesMenu}
              >
                Categories <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Mega menu for categories */}
              {categoriesOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Eyeglasses</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/products?category=men" className="text-gray-700 hover:text-primary-600 block">
                          Men's Eyeglasses
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=women" className="text-gray-700 hover:text-primary-600 block">
                          Women's Eyeglasses
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=kids" className="text-gray-700 hover:text-primary-600 block">
                          Kids' Eyeglasses
                        </Link>
                      </li>
                    </ul>
                    
                    <h3 className="font-semibold text-gray-900 mt-4 mb-2">Sunglasses</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/products?category=sunglasses-men" className="text-gray-700 hover:text-primary-600 block">
                          Men's Sunglasses
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=sunglasses-women" className="text-gray-700 hover:text-primary-600 block">
                          Women's Sunglasses
                        </Link>
                      </li>
                    </ul>
                    
                    <h3 className="font-semibold text-gray-900 mt-4 mb-2">Contact Lenses</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/products?category=colored-lenses" className="text-gray-700 hover:text-primary-600 block">
                          Colored Lenses
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=daily-lenses" className="text-gray-700 hover:text-primary-600 block">
                          Daily Disposable
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/products?type=eyeglasses" className="text-gray-700 hover:text-primary-600 font-medium">
                Eyeglasses
              </Link>
            </li>
            <li>
              <Link to="/products?type=sunglasses" className="text-gray-700 hover:text-primary-600 font-medium">
                Sunglasses
              </Link>
            </li>
            <li>
              <Link to="/products?type=contact-lenses" className="text-gray-700 hover:text-primary-600 font-medium">
                Contact Lenses
              </Link>
            </li>
            <li>
              <Link to="/products?type=accessories" className="text-gray-700 hover:text-primary-600 font-medium">
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/book-appointment" className="text-primary-600 hover:text-primary-800 font-semibold">
                Book Eye Test
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for products..."
                className="input pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={20} />
              </button>
            </div>
            
            <ul className="space-y-4 pb-4">
              <li>
                <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Home
                </Link>
              </li>
              <li>
                <button 
                  className="flex items-center justify-between w-full text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown size={16} className={`transform transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {categoriesOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <Link to="/products?category=men" className="text-gray-700 hover:text-primary-600 block py-1">
                        Men's Eyeglasses
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=women" className="text-gray-700 hover:text-primary-600 block py-1">
                        Women's Eyeglasses
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=kids" className="text-gray-700 hover:text-primary-600 block py-1">
                        Kids' Eyeglasses
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=sunglasses-men" className="text-gray-700 hover:text-primary-600 block py-1">
                        Men's Sunglasses
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=sunglasses-women" className="text-gray-700 hover:text-primary-600 block py-1">
                        Women's Sunglasses
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/products?type=eyeglasses" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link to="/products?type=sunglasses" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link to="/products?type=contact-lenses" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Contact Lenses
                </Link>
              </li>
              <li>
                <Link to="/products?type=accessories" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-primary-600 hover:text-primary-800 font-semibold block py-2">
                  Book Eye Test
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium block py-2">
                  Contact
                </Link>
              </li>
              
              {!isAuthenticated && (
                <li className="pt-2 border-t border-gray-200">
                  <Link to="/login" className="btn btn-primary w-full text-center">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;