
// src/components/MarketShopTable.js
// A table to display all shops within a market, with pagination.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';

const SHOPS_PER_PAGE = 8;

const MarketShopTable = ({ shops }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(shops.length / SHOPS_PER_PAGE);
  const currentShops = shops.slice(
    (currentPage - 1) * SHOPS_PER_PAGE,
    currentPage * SHOPS_PER_PAGE
  );

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  if (shops.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">There are no registered shops in this market yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">Shop Name</th>
              <th className="px-5 py-3 font-semibold">Specialty</th>
              <th className="px-5 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentShops.map(shop => (
              <tr key={shop.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-full mr-4 flex-shrink-0" />
                    <p className="text-gray-900 font-semibold whitespace-no-wrap">{shop.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{shop.specialty}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <Link
                    to={`/shop/${shop.id}`}
                    className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold"
                  >
                    <FiEye className="mr-2" /> View Shop
                  </Link>
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
  );
};

export default MarketShopTable;
