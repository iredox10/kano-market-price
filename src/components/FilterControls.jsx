
// src/components/FilterControls.js
// A component with functional filters for the search results page, now including a search bar.

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { databases } from '../appwrite/config';
import { DATABASE_ID, MARKETS_COLLECTION_ID } from '../appwrite/constants';

const FilterControls = ({ sortOption, setSortOption, stockFilter, setStockFilter, marketFilter, setMarketFilter, searchTerm, setSearchTerm }) => {
  const [markets, setMarkets] = useState([]);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const marketDropdownRef = useRef(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, MARKETS_COLLECTION_ID);
        setMarkets(response.documents);
      } catch (error) {
        console.error("Failed to fetch markets for filter:", error);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marketDropdownRef.current && !marketDropdownRef.current.contains(event.target)) {
        setIsMarketDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarketChange = (marketName) => {
    setMarketFilter(prev =>
      prev.includes(marketName)
        ? prev.filter(m => m !== marketName)
        : [...prev, marketName]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Refine Search */}
        <div>
          <label htmlFor="refine-search" className="block text-sm font-medium text-gray-700 mb-1">Refine Search</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="refine-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter results by name..."
              className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

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
        <div className="relative" ref={marketDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Market</label>
          <button
            type="button"
            onClick={() => setIsMarketDropdownOpen(prev => !prev)}
            className="w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-left flex items-center justify-between"
          >
            <span className="text-gray-700">
              {marketFilter.length === 0 ? 'All Markets' : `${marketFilter.length} selected`}
            </span>
            <FiChevronDown className={`text-gray-400 transition-transform ${isMarketDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMarketDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border z-10 max-h-60 overflow-y-auto">
              {markets.map(market => (
                <label key={market.$id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketFilter.includes(market.name)}
                    onChange={() => handleMarketChange(market.name)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{market.name}</span>
                </label>
              ))}
            </div>
          )}
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
