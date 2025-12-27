import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../ui/Logo";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Appointments", path: "/admin/appointments", icon: <Calendar size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
              ${
                location.pathname === item.path
                  ? "bg-primary-800 text-white"
                  : "text-primary-100 hover:bg-primary-800"
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

        {/* Logout */}
        <div className="mt-auto px-2 pb-4 border-t border-primary-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-primary-100 hover:bg-primary-800 rounded-md"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600"
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto">
            <Link to="/" className="text-sm text-primary-600 hover:underline">
              View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
