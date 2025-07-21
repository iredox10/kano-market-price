
// src/components/FilterControls.js
// A component to house all the filtering and sorting controls for the search results.

import React from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { allMarkets } from '../data/mockData';

const FilterControls = ({ sortOption, setSortOption, stockFilter, setStockFilter, marketFilter, setMarketFilter }) => {

  const handleMarketChange = (marketName) => {
    setMarketFilter(prev =>
      prev.includes(marketName)
        ? prev.filter(m => m !== marketName)
        : [...prev, marketName]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sort By */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="date_desc">Date: Newest First</option>
          </select>
        </div>

        {/* Filter by Market */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Market</label>
          <div className="relative">
            <select className="w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none">
              <option>Select markets...</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {/* A full multi-select dropdown would be complex, so this is a simplified placeholder.
               In a real app, you might use a library like 'react-select'. */}
        </div>

        {/* Filter by Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <div className="h-11 flex items-center">
            <div className="flex items-center">
              <input
                id="in-stock"
                type="checkbox"
                checked={stockFilter}
                onChange={(e) => setStockFilter(e.target.checked)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
                In Stock Only
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
