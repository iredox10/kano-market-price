
// src/components/SearchSummary.js
// A component to display key statistics about the search results.

import React from 'react';
import { FiTag, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

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

const SearchSummary = ({ count, lowestPrice, averagePrice }) => {
  // Don't render the component if there are no results to summarize
  if (count === 0) {
    return null;
  }

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
          value={`₦${lowestPrice.toLocaleString()}`}
          color="border-green-500"
        />
        <StatCard
          icon={<FiBarChart2 size={24} />}
          title="Average Price"
          value={`₦${Math.round(averagePrice).toLocaleString()}`}
          color="border-yellow-500"
        />
      </div>
    </div>
  );
};

export default SearchSummary;
