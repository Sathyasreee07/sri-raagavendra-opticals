import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for large screens */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white hover:text-secondary-300 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-800 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                {location.pathname === item.path && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t border-primary-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-primary-100 rounded-md hover:bg-primary-800 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-500 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-primary-600 hover:text-primary-800">
                View Website
              </Link>
              <div className="relative">
                <img
                  // src="https://via.placeholder.com/36?text=A"
                  alt="Admin User"
                  className="h-9 w-9 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;