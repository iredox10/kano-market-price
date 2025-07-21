
// src/pages/MarketDetailsPage.js
// Displays a rich, detailed page for a single market with a shop search and table.

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allShopOwners, allMarkets } from '../data/mockData';
import MarketShopTable from '../components/MarketShopTable';
import { FiClock, FiTag, FiMapPin, FiSearch } from 'react-icons/fi';

const InfoCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-start">
      <div className="mr-4 text-green-600 flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
        <div className="text-gray-600 mt-1">{children}</div>
      </div>
    </div>
  </div>
);

const MarketDetailsPage = () => {
  const { marketName } = useParams();
  const market = allMarkets.find(m => m.slug === marketName);
  const [searchTerm, setSearchTerm] = useState('');

  const marketShops = market
    ? allShopOwners.filter(s => s.market === market.name)
    : [];

  const filteredShops = useMemo(() => {
    if (!searchTerm) {
      return marketShops;
    }
    return marketShops.filter(shop =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, marketShops]);

  if (!market) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Market not found</h2>
        <Link to="/" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800">{market.name}</h1>
          <p className="mt-2 text-lg text-gray-600 max-w-3xl">{market.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-1 space-y-8">
            <InfoCard icon={<FiMapPin size={24} />} title="Market Location">
              <p>{market.name}, Kano, Nigeria</p>
            </InfoCard>

            <InfoCard icon={<FiClock size={24} />} title="Opening Hours">
              <p>{market.openingHours || 'Not available'}</p>
            </InfoCard>

            <InfoCard icon={<FiTag size={24} />} title="Key Specialties">
              {market.specialties && market.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {market.specialties.map(spec => (
                    <span key={spec} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{spec}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </InfoCard>
          </div>

          {/* Right Column: Shops Table with Search */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Shops in {market.name}</h2>
              <div className="relative w-full sm:w-auto sm:max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <MarketShopTable shops={filteredShops} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailsPage;
