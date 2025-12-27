import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  Shield,
} from "lucide-react";
import Logo from "../ui/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold">
                Sri Ragavendra<span className="text-secondary-500">Opticals</span>
              </span>
            </div>

            <p className="text-gray-400 mb-4">
              Providing premium eyewear and eye care services since 1995.
            </p>

            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin size={18} className="text-secondary-500 mr-2 mt-1" />
                <span className="text-gray-400">
                  No 87, Big Chetty Street, Chengalpattu, Tamil Nadu – 603001
                </span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-secondary-500 mr-2" />
                <span className="text-gray-400">+91 99941 79456</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-secondary-500 mr-2" />
                <span className="text-gray-400">
                  sriragavendraopticals1990@gmail.com
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ["/", "Home"],
                ["/products", "Shop"],
                ["/book-appointment", "Book Eye Test"],
                ["/about", "About Us"],
                ["/contact", "Contact"],
              ].map(([path, label]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-secondary-500"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                ["eyeglasses", "Eyeglasses"],
                ["sunglasses", "Sunglasses"],
                ["contact-lenses", "Contact Lenses"],
                ["accessories", "Accessories"],
              ].map(([type, label]) => (
                <li key={type}>
                  <Link
                    to={`/products?type=${type}`}
                    className="text-gray-400 hover:text-secondary-500"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for latest offers & updates.
            </p>

            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-2 w-full rounded-l-md text-gray-900"
              />
              <button className="bg-secondary-500 px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </form>

            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-primary-800"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment & Trust */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <Shield size={18} className="text-secondary-500" />
            Secure Payments
            <CreditCard size={18} className="text-secondary-500 ml-4" />
            Easy Returns
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sri Ragavendra Opticals. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
