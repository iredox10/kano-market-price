
// src/components/ProductCard.js
// A redesigned, premium product card with a clean and light theme.

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiMinus, FiBox, FiDroplet, FiFeather, FiGrid, FiPackage, FiChevronsRight } from 'react-icons/fi';

const categoryIcons = {
  'Grains': <FiBox size={20} />,
  'Oils': <FiDroplet size={20} />,
  'Vegetables': <FiFeather size={20} />,
  'Tubers': <FiGrid size={20} />,
  'Pasta': <FiPackage size={20} />,
  'Meat': <FiPackage size={20} />,
};

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;

  if (current > previous) {
    return <FiArrowUp className="text-orange-500" title="Price increased" />;
  }
  if (current < previous) {
    return <FiArrowDown className="text-green-500" title="Price decreased" />;
  }
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const ProductCard = ({ product }) => {
  const { name, category, currentPrice, id } = product;
  const icon = categoryIcons[category] || <FiPackage size={20} />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full border border-gray-200/80 transform hover:-translate-y-2 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl">
          {icon}
        </div>
        <PriceTrendIndicator current={currentPrice?.owner} previous={currentPrice?.previousOwnerPrice} />
      </div>

      <div className="flex-grow">
        <p className="text-sm font-semibold text-gray-500 mb-1">{category}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-4 h-14">{name}</h3>
      </div>

      <div className="mt-auto">
        <p className="text-sm text-gray-500">Starting from</p>
        <p className="text-3xl font-bold text-green-600 mb-4">
          {currentPrice?.owner ? `₦${currentPrice.owner.toLocaleString()}` : 'N/A'}
        </p>
        <Link
          to={`/search?q=${encodeURIComponent(name)}`}
          className="group inline-flex items-center font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          View All Prices
          <FiChevronsRight className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
