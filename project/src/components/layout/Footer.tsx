import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  CreditCard,
  Shield
} from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        {/* Footer top - main sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-poppins font-bold text-white">
                Sri Ragavendra<span className="text-secondary-500">Opticals</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Providing premium eyewear and eye care services since 1995. We are committed to offering the best optical solutions for your vision needs.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="text-secondary-500 mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Main Street, Chennai, Tamil Nadu, 600001</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-secondary-500 mr-2 flex-shrink-0" size={18} />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-secondary-500 mr-2 flex-shrink-0" size={18} />
                <span className="text-gray-400">contact@sriragavendraopticals.com</span>
              </div>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Book an Eye Test
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 font-poppins">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?type=eyeglasses" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link to="/products?type=sunglasses" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link to="/products?type=contact-lenses" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Contact Lenses
                </Link>
              </li>
              <li>
                <Link to="/products?type=accessories" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=kids" className="text-gray-400 hover:text-secondary-500 transition-colors">
                  Kids Collection
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 font-poppins">Stay Connected</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="mb-4">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md focus:outline-none w-full text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-r-md font-medium transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-primary-800 p-2 rounded-full transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary-800 p-2 rounded-full transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary-800 p-2 rounded-full transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary-800 p-2 rounded-full transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Middle section - Payment & trust */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="text-gray-400">Payment Methods:</span>
              <div className="flex space-x-2">
                {/* <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=VISA" alt="Visa" className="h-6" />
                <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=MC" alt="MasterCard" className="h-6" />
                <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=AMEX" alt="Amex" className="h-6" />
                <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=PAYTM" alt="Paytm" className="h-6" />
                <img src="https://via.placeholder.com/40x25/FFFFFF/000000?text=UPI" alt="UPI" className="h-6" /> */}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                <Shield size={18} className="text-secondary-500 mr-1" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <CreditCard size={18} className="text-secondary-500 mr-1" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sri Ragavendra Opticals. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-600">
            <Link to="/privacy-policy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-gray-400">Terms of Service</Link>
            <Link to="/return-policy" className="hover:text-gray-400">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;