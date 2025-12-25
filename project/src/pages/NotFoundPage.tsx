import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold text-primary-600 mb-4 font-poppins">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn btn-primary flex items-center">
              <Home size={20} className="mr-2" />
              Back to Home
            </Link>
            <Link to="/products" className="btn btn-outline flex items-center">
              <Search size={20} className="mr-2" />
              Browse Products
            </Link>
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-semibold mb-4">Looking for something specific?</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/products" className="text-primary-600 hover:text-primary-800">
                  Browse our collection of eyewear
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-primary-600 hover:text-primary-800">
                  Book an eye examination
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-600 hover:text-primary-800">
                  Contact our support team
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;