
// src/components/ProductFilters.js
// A redesigned, compact filter component for the products page.

import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite/config';
import { DATABASE_ID, CATEGORIES_COLLECTION_ID } from '../appwrite/constants';
import { FiSearch } from 'react-icons/fi';

const ProductFilters = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, stockFilter, setStockFilter }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);
        setCategories(response.documents);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search by Name */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name..."
              className="w-full h-11 pl-12 pr-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Filter by Category */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.$id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Filter by Stock */}
        <div className="h-11 flex items-center bg-gray-50 px-4 rounded-md">
          <div className="flex items-center">
            <input
              id="in-stock-filter"
              type="checkbox"
              checked={stockFilter}
              onChange={(e) => setStockFilter(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="in-stock-filter" className="ml-3 text-sm font-medium text-gray-700">
              Show In Stock Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
