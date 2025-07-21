
// src/components/MarketCard.js
// A reusable card to display individual market information.

import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiTag, FiChevronsRight } from 'react-icons/fi';

const MarketCard = ({ market }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full border border-gray-200/80 transform hover:-translate-y-2 transition-transform duration-300">
      <div className="flex-grow">
        <div className="flex items-center mb-3">
          <FiMapPin className="text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">{market.name}</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed h-24 overflow-hidden">
          {market.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {market.specialties?.slice(0, 3).map(spec => (
            <span key={spec} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{spec}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          to={`/market/${market.slug}`}
          className="group inline-flex items-center font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          Explore Market
          <FiChevronsRight className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default MarketCard;
