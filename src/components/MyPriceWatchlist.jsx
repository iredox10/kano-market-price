
// src/components/MyPriceWatchlist.js
// A powerful component for users to track their favorite products.

import React from 'react';
import { Link } from 'react-router-dom';
import { allProducts, myAccountData } from '../data/mockData';
import { FiArrowUp, FiArrowDown, FiMinus, FiBell, FiEye } from 'react-icons/fi';

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (current > previous) return <FiArrowUp className="text-orange-500" title="Price increased" />;
  if (current < previous) return <FiArrowDown className="text-green-500" title="Price decreased" />;
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const MyPriceWatchlist = () => {
  const favoriteProducts = allProducts.filter(p => myAccountData.favoriteProductIds.includes(p.id));

  const priceDrops = favoriteProducts.filter(p => p.currentPrice.owner < p.currentPrice.previousOwnerPrice).length;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">My Price Watchlist</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Items Tracked</p>
          <p className="text-2xl font-bold text-gray-800">{favoriteProducts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Price Drops This Week</p>
          <p className="text-2xl font-bold text-green-600">{priceDrops}</p>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Best Price</th>
              <th className="px-5 py-3 font-semibold">Found At</th>
              <th className="px-5 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favoriteProducts.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-semibold">{product.name}</p>
                      <p className="text-gray-600 text-sm">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <p className="text-gray-800 font-bold text-lg mr-2">{`₦${product.currentPrice.owner.toLocaleString()}`}</p>
                    <PriceTrendIndicator current={product.currentPrice.owner} previous={product.currentPrice.previousOwnerPrice} />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Link to={`/shop/${product.id}`} className="text-blue-600 font-semibold hover:underline">
                    {product.shop}
                  </Link>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center space-x-3">
                    <button className="text-gray-500 hover:text-green-600" title="Set Price Alert">
                      <FiBell size={20} />
                    </button>
                    <Link to={`/product/${product.id}`} className="text-gray-500 hover:text-blue-600" title="View Details">
                      <FiEye size={20} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPriceWatchlist;
