import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  brand: string;
  category: string;
  type: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
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

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    brand: '',
    priceRange: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        search: searchQuery,
        ...filters
      } as any); // casting because filters is an object with string values

      const response = await fetch(`/api/admin/products?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch products');

      setProducts(data.products);
      setTotalPages(data.pages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      brand: '',
      priceRange: '',
      status: ''
    });
    setPage(1);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/admin/products/${selectedProduct._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      setSuccess('Product deleted successfully');
      setProducts(prev => prev.filter(p => p._id !== selectedProduct._id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleStatusToggle = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update status');
      }

      setProducts(prev =>
        prev.map(p =>
          p._id === productId ? { ...p, isActive } : p
        )
      );

      setSuccess(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Products</h1>
        <button className="btn btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add New Product
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-4 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-800 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 text-green-800 p-4 rounded-md flex items-center">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <p>{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-800 hover:text-green-600"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </form>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
            type="button"
          >
            <Filter size={20} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              <option value="eyeglasses">Eyeglasses</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-lenses">Contact Lenses</option>
              <option value="accessories">Accessories</option>
            </select>

            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="input"
            >
              <option value="">All Brands</option>
              <option value="rayban">Ray-Ban</option>
              <option value="oakley">Oakley</option>
              <option value="gucci">Gucci</option>
              {/* Add more brands */}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="input"
            >
              <option value="">All Prices</option>
              <option value="0-1000">₹0 - ₹1000</option>
              <option value="1001-3000">₹1001 - ₹3000</option>
              <option value="3001-5000">₹3001 - ₹5000</option>
              <option value="5000+">₹5000+</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
              <option value="new">New</option>
            </select>

            <button
              onClick={clearFilters}
              className="btn btn-secondary col-span-full md:col-span-1"
              type="button"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center p-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={product.images[0]?.url || '/placeholder.png'}
                      alt={product.images[0]?.alt || product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">₹{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.type}</td>
                  <td className="px-4 py-2">{product.stock}</td>

                  {/* Active Toggle */}
                  <td className="px-4 py-2 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.isActive}
                        onChange={(e) => handleStatusToggle(product._id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:bg-primary-600 transition-colors"></div>
                      <span className="absolute left-1 top-1 bg-white border border-gray-300 rounded-full w-4 h-4 transition-transform peer-checked:translate-x-5"></span>
                    </label>
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-2 text-center">
                    {product.isFeatured ? (
                      <Check className="inline text-green-600" size={20} />
                    ) : (
                      <X className="inline text-gray-400" size={20} />
                    )}
                  </td>

                  {/* New */}
                  <td className="px-4 py-2 text-center">
                    {product.isNew ? (
                      <Check className="inline text-green-600" size={20} />
                    ) : (
                      <X className="inline text-gray-400" size={20} />
                    )}
                  </td>

                  <td className="px-4 py-2">{product.discount ? `${product.discount}%` : '-'}</td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-outline btn-sm"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="btn btn-outline btn-sm btn-danger"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => alert('View details is not implemented yet')}
                      className="btn btn-outline btn-sm"
                      title="View Product"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn btn-outline"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-outline"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Edit Modal (Placeholder) */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <h2 className="text-xl font-semibold mb-4">Edit Product: {selectedProduct.name}</h2>
            {/* Your edit form goes here */}

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Close edit modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{selectedProduct.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
