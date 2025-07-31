
// src/pages/admin/CategoryProductsPage.js
// A page to display and manage all products within a specific category.

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, SHOP_OWNERS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiChevronLeft, FiChevronRight, FiTag, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import AddEditProductModal from '../../components/admin/AddEditProductModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import InfoModal from '../../components/InfoModal';

const ITEMS_PER_PAGE = 10;

const StockStatusBadge = ({ status }) => {
  const colorClasses = {
    'In Stock': 'bg-green-100 text-green-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      <span className="relative">{status}</span>
    </span>
  );
};

const CategoryProductsPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [shopOwnersMap, setShopOwnersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const [productsRes, ownersRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.equal('category', decodeURIComponent(categoryName))]),
        databases.listDocuments(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID)
      ]);

      setProducts(productsRes.documents);

      const ownersMap = ownersRes.documents.reduce((acc, owner) => {
        acc[owner.$id] = owner.name;
        return acc;
      }, {});
      setShopOwnersMap(ownersMap);

    } catch (error) {
      console.error(`Failed to fetch data for category ${categoryName}:`, error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to load data.', type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [categoryName]);

  const handleDelete = async (product) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, product.$id);
      setModal({ type: 'info', data: { title: 'Success', message: `Product "${product.name}" has been deleted.`, type: 'success' } });
      fetchPageData(); // Refresh list
    } catch (error) {
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to delete product.', type: 'error' } });
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <>
      <AddEditProductModal
        isOpen={modal.type === 'addEdit'}
        onClose={() => setModal({ type: null })}
        product={modal.data}
        onSave={(message) => { fetchPageData(); setModal({ type: 'info', data: { title: 'Success', message, type: 'success' } }); }}
        onError={(message) => setModal({ type: 'info', data: { title: 'Error', message, type: 'error' } })}
      />
      <InfoModal isOpen={modal.type === 'info'} onClose={() => setModal({ type: null })} {...modal.data} />
      <ConfirmationModal
        isOpen={modal.type === 'confirmDelete'}
        onClose={() => setModal({ type: null })}
        onConfirm={() => { handleDelete(modal.data); setModal({ type: null }); }}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${modal.data?.name}"?`}
      />
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/admin/manage-categories" className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold mb-2">
              <FiChevronLeft className="mr-2" />
              Back to All Categories
            </Link>
            <div className="flex items-center">
              <FiTag className="text-2xl text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Products in "{decodeURIComponent(categoryName)}"</h1>
            </div>
          </div>
          <button onClick={() => setModal({ type: 'addEdit', data: null })} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
            <FiPlus className="mr-2" /> Add Product
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-12 text-center text-gray-500">Loading products...</p>
          ) : products.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-5 py-3 font-semibold">Product Name</th>
                  <th className="px-5 py-3 font-semibold">Shop Owner</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock Status</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr key={product.$id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4 text-gray-800 font-semibold">{product.name}</td>
                    <td className="px-5 py-4 text-gray-700">{shopOwnersMap[product.shopOwnerId] || product.shopOwnerId}</td>
                    <td className="px-5 py-4 text-green-600 font-bold">{`₦${product.ownerPrice.toLocaleString()}`}</td>
                    <td className="px-5 py-4">
                      <StockStatusBadge status={product.stockStatus} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button onClick={() => setModal({ type: 'addEdit', data: product })} className="text-blue-500 hover:text-blue-700" title="Edit Product"><FiEdit size={20} /></button>
                        <button onClick={() => setModal({ type: 'confirmDelete', data: product })} className="text-red-500 hover:text-red-700" title="Delete Product"><FiTrash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-12 text-center text-gray-600">No products found in this category.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="mr-2" /> Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <FiChevronRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryProductsPage;
