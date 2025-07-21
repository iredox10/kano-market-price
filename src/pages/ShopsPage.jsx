
// src/pages/ShopsPage.js
// This page displays a list of all shop owners with search functionality.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { allShopOwners } from '../data/mockData';
import ShopOwnerCard from '../components/ShopOwnerCard';

const ShopsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter shop owners based on search term (name or specialty)
  const filteredShops = allShopOwners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800">Shop Owners</h1>
          <p className="mt-2 text-gray-600">Find your favorite and most trusted sellers in the market.</p>

          {/* Search Bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shop name or specialty (e.g., Grains)"
                className="w-full h-12 pl-10 pr-4 rounded-full text-md text-gray-700 border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shops Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredShops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShops.map(owner => (
                <ShopOwnerCard key={owner.id} owner={owner} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">No Shops Found</h2>
              <p className="mt-2 text-gray-500">
                We couldn't find any shops matching "{searchTerm}". Try a different search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopsPage;
