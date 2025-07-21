
// src/pages/ProductDetailsPage.js
// Displays detailed information about a single product.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/mockData';
import PriceDisplay from '../components/PriceDisplay';
import PriceHistoryChart from '../components/PriceHistoryChart';
import { FiChevronLeft } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Link to="/products" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
          <FiChevronLeft className="mr-1" />
          Back to All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Description */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
              <h1 className="text-3xl font-bold text-gray-800 mt-4">{product.name}</h1>
              <p className="text-md text-gray-500">Sold by <Link to={`/shop/${product.id}`} className="text-blue-500 hover:underline">{product.shop}</Link></p>
              <p className="mt-4 text-gray-700">{product.description}</p>
            </div>
          </div>

          {/* Right Column: Price Info and Chart */}
          <div className="lg:col-span-2">
            <PriceDisplay
              ownerPrice={product.currentPrice.owner}
              communityPrice={product.currentPrice.community}
            />
            <PriceHistoryChart priceHistory={product.priceHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
