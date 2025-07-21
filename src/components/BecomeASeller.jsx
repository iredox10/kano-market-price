
// src/components/BecomeASeller.js
// A component encouraging users to apply to become a shop owner.

import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const BecomeASeller = () => (
  <div className="bg-white shadow-md rounded-lg p-8 text-center">
    <FiShoppingBag className="mx-auto h-16 w-16 text-green-500" />
    <h3 className="text-2xl font-bold text-gray-800 mt-4">Become a Verified Seller</h3>
    <p className="mt-2 text-gray-600 max-w-md mx-auto">
      Register your shop to list your products, reach more customers, and build trust within the community.
    </p>
    <Link
      to="/apply-to-sell"
      className="mt-6 inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 font-semibold text-lg"
    >
      Start Your Application
    </Link>
  </div>
);

export default BecomeASeller;
