
// src/components/PriceDisplay.js
// Displays and differentiates between owner and community prices.

import React from 'react';
import { FiCheckCircle, FiUsers } from 'react-icons/fi';

const PriceDisplay = ({ ownerPrice, communityPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Current Prices</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Owner's Price */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-700 mb-2">
            <FiCheckCircle className="mr-2" />
            <h4 className="font-semibold">Shop Owner's Price</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {ownerPrice ? `₦${ownerPrice.toLocaleString()}` : 'Not Available'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Verified Price</p>
        </div>

        {/* Community Price */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center text-blue-700 mb-2">
            <FiUsers className="mr-2" />
            <h4 className="font-semibold">Community Average</h4>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {communityPrice ? `₦${communityPrice.toLocaleString()}` : 'No Contributions Yet'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Based on public contributions</p>
        </div>

      </div>
    </div>
  );
};

export default PriceDisplay;
