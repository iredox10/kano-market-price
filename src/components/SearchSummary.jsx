
// src/components/SearchSummary.js
// A component to display key statistics about the search results.

import React from 'react';
import { FiTag, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const SearchSummary = ({ count, lowestPrice, highestPrice }) => {
  // Don't render the component if there are no results to summarize
  if (count === 0) {
    return null;
  }

  // --- THE FIX ---
  // Safely format the prices, providing a fallback if the value is not a valid number.
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₦${price.toLocaleString()}`;
    }
    return 'N/A';
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<FiTag size={24} />}
          title="Prices Found"
          value={count}
          color="border-blue-500"
        />
        <StatCard
          icon={<FiTrendingDown size={24} />}
          title="Lowest Price"
          value={formatPrice(lowestPrice)}
          color="border-green-500"
        />
        <StatCard
          icon={<FiTrendingUp size={24} />}
          title="Highest Price"
          value={formatPrice(highestPrice)}
          color="border-orange-500"
        />
      </div>
    </div>
  );
};

export default SearchSummary;
