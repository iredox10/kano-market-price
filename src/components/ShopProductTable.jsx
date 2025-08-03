
// src/components/ShopProductTable.js
// A detailed table to display a shop's products with pagination and images.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback'; // Import the image component
import { PRODUCT_IMAGES_BUCKET_ID } from '../appwrite/constants';

const PRODUCTS_PER_PAGE = 5;

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

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;

  if (current > previous) {
    return <FiArrowUp className="text-orange-500" title="Price increased" />;
  }
  if (current < previous) {
    return <FiArrowDown className="text-green-500" title="Price decreased" />;
  }
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const ShopProductTable = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  if (products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">This shop owner has not listed any products yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold text-right">Price</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => (
              <tr key={product.$id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    {/* --- THE FIX --- */}
                    <ImageWithFallback
                      fileId={product.imageFileId}
                      bucketId={PRODUCT_IMAGES_BUCKET_ID}
                      fallbackText={product.name}
                      className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0"
                    />
                    <Link to={`/product/${product.$id}`} className="text-gray-900 font-semibold whitespace-no-wrap hover:text-green-600">
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end">
                    <p className="text-gray-800 font-bold text-lg whitespace-no-wrap mr-2">
                      {`₦${(product.ownerPrice || 0).toLocaleString()}`}
                    </p>
                    <PriceTrendIndicator current={product.ownerPrice} previous={product.previousOwnerPrice} />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StockStatusBadge status={product.stockStatus} />
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{product.category}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-4 bg-white flex justify-between items-center">
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
      )}
    </div>
  );
};

export default ShopProductTable;
