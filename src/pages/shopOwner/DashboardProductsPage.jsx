
// src/pages/shopOwner/DashboardProductsPage.js
// Page for shop owners to view and manage their products, now with working edit links.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../../data/mockData';
import { FiEdit, FiTrash2, FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ITEMS_PER_PAGE = 5;

const DashboardProductsPage = () => {
  const ownerProducts = allProducts;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ownerProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = ownerProducts.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
        <Link
          to="/dashboard/add-product"
          className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          <FiPlusCircle className="mr-2" />
          Add New Product
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">Product Name</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Stock Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                    <p className="text-gray-900 font-semibold whitespace-no-wrap">{product.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{product.category}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-green-600 font-bold whitespace-no-wrap">
                    {product.currentPrice && typeof product.currentPrice.owner === 'number'
                      ? `₦${product.currentPrice.owner.toLocaleString()}`
                      : 'N/A'}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                      ${product.stockStatus === 'In Stock' ? 'text-green-900 bg-green-200' : ''}
                      ${product.stockStatus === 'Low Stock' ? 'text-yellow-900 bg-yellow-200' : ''}
                      ${product.stockStatus === 'Out of Stock' ? 'text-red-900 bg-red-200' : ''}
                    `}>
                    <span className="relative">{product.stockStatus}</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex space-x-4">
                    <Link to={`/dashboard/edit-product/${product.id}`} className="text-blue-500 hover:text-blue-700" title="Edit Product">
                      <FiEdit size={20} />
                    </Link>
                    <button className="text-red-500 hover:text-red-700" title="Delete Product">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="mr-2" />
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FiChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DashboardProductsPage;
