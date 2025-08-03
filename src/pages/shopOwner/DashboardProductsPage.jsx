
// src/pages/shopOwner/DashboardProductsPage.js
// A mobile-friendly page for shop owners to manage their products, now with search and filters.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiEdit, FiTrash2, FiPlusCircle, FiChevronLeft, FiChevronRight, FiInbox, FiSearch } from 'react-icons/fi';
import ConfirmationModal from '../../components/ConfirmationModal';
import InfoModal from '../../components/InfoModal';
import ImageWithFallback from '../../components/ImageWithFallback';

const ITEMS_PER_PAGE = 8;

const StockStatusBadge = ({ status }) => {
  const colorClasses = {
    'In Stock': 'bg-green-100 text-green-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const DashboardProductsPage = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.equal('shopOwnerId', currentUser.$id)]
      );
      setProducts(response.documents);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Could not load your products.', type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const handleDelete = async (product) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, product.$id);
      setModal({ type: 'info', data: { title: 'Success', message: `Product "${product.name}" has been deleted.`, type: 'success' } });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete product:", error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to delete product.', type: 'error' } });
    }
  };

  const uniqueCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <>
      <InfoModal isOpen={modal.type === 'info'} onClose={() => setModal({ type: null })} {...modal.data} />
      <ConfirmationModal
        isOpen={modal.type === 'confirmDelete'}
        onClose={() => setModal({ type: null })}
        onConfirm={() => {
          handleDelete(modal.data);
          setModal({ type: null });
        }}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${modal.data?.name}"? This action cannot be undone.`}
      />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
          <Link
            to="/dashboard/add-product"
            className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
          >
            <FiPlusCircle className="mr-2" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-12 text-center text-gray-500">Loading your products...</p>
        ) : products.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
              {currentProducts.map(product => (
                <div key={product.$id} className="bg-white p-4 rounded-lg shadow-md border">
                  <div className="flex items-start gap-4">
                    <ImageWithFallback
                      fileId={product.imageFileId}
                      bucketId={PRODUCT_IMAGES_BUCKET_ID}
                      fallbackText={product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-green-600 font-bold">{`₦${product.ownerPrice.toLocaleString()}`}</p>
                      <StockStatusBadge status={product.stockStatus} />
                    </div>
                    <div className="flex space-x-3">
                      <Link to={`/dashboard/edit-product/${product.$id}`} className="p-2 text-blue-500 hover:bg-gray-100 rounded-full"><FiEdit size={18} /></Link>
                      <button onClick={() => setModal({ type: 'confirmDelete', data: product })} className="p-2 text-red-500 hover:bg-gray-100 rounded-full"><FiTrash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Price</th>
                    <th className="px-5 py-3 font-semibold">Stock Status</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product.$id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <ImageWithFallback
                            fileId={product.imageFileId}
                            bucketId={PRODUCT_IMAGES_BUCKET_ID}
                            fallbackText={product.name}
                            className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0"
                          />
                          <p className="text-gray-900 font-semibold whitespace-no-wrap">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4"><p className="text-gray-700 whitespace-no-wrap">{product.category}</p></td>
                      <td className="px-5 py-4"><p className="text-green-600 font-bold whitespace-no-wrap">{`₦${product.ownerPrice.toLocaleString()}`}</p></td>
                      <td className="px-5 py-4"><StockStatusBadge status={product.stockStatus} /></td>
                      <td className="px-5 py-4">
                        <div className="flex space-x-4">
                          <Link to={`/dashboard/edit-product/${product.$id}`} className="text-blue-500 hover:text-blue-700" title="Edit Product"><FiEdit size={20} /></Link>
                          <button onClick={() => setModal({ type: 'confirmDelete', data: product })} className="text-red-500 hover:text-red-700" title="Delete Product"><FiTrash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronLeft className="mr-2" /> Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next <FiChevronRight className="ml-2" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-12">
            <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">{searchTerm || categoryFilter ? "No products match your filters." : "You haven't added any products yet."}</p>
            <Link to="/dashboard/add-product" className="mt-2 inline-block text-green-600 font-semibold hover:underline">Add your first product</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardProductsPage;
