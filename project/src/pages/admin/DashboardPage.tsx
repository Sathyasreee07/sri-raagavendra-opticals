import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalAppointments: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }>;
  recentAppointments: Array<{
    _id: string;
    patientName: string;
    serviceType: string;
    date: string;
    time: string;
    status: string;
  }>;
  salesData: {
    labels: string[];
    data: number[];
  };
  topProducts: Array<{
    _id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    recentOrders: [],
    recentAppointments: [],
    salesData: { labels: [], data: [] },
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/dashboard?timeframe=${timeframe}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [timeframe]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-success-100 text-success-900';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-error-100 text-error-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 text-error-900 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('today')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'today'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-success-600 flex items-center">
              <ArrowUpRight size={16} className="mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">
            ₹{stats.totalSales.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-secondary-600" />
            </div>
            <span className="text-success-600 flex items-center">
              <ArrowUpRight size={16} className="mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-success-600 flex items-center">
              <ArrowUpRight size={16} className="mr-1" />
              15%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalCustomers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-pink-600" />
            </div>
            <span className="text-error-600 flex items-center">
              <ArrowDownRight size={16} className="mr-1" />
              3%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Appointments</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalAppointments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(order.status)
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Appointments
              </h2>
              <Link
                to="/admin/appointments"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.serviceType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()}{' '}
                      {appointment.time}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(appointment.status)
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-primary-600 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              {/* Add your preferred chart library here */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Chart Component Here
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <Link
                to="/admin/products"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                View All Products
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.sales} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{product.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-success-600 flex items-center">
                          <TrendingUp size={16} className="mr-1" />
                          12%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;