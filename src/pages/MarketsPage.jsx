
// src/pages/MarketsPage.js
// A page to browse and search all available markets.

import React, { useState, useMemo } from 'react';
import { allMarkets } from '../data/mockData';
import MarketCard from '../components/MarketCard';
import { FiSearch } from 'react-icons/fi';

const MarketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = useMemo(() => {
    if (!searchTerm) {
      return allMarkets;
    }
    return allMarkets.filter(market =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800">Explore Kano's Markets</h1>
          <p className="mt-2 text-gray-600">Discover the hubs of commerce where prices are set and deals are made.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a market..."
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMarkets.map(market => (
            <MarketCard key={market.slug} market={market} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;
