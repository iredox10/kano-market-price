import React from 'react';
import { FiX } from 'react-icons/fi';
import PriceHistoryChart from './PriceHistoryChart'; // We'll reuse the existing chart component

const PriceChartModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Price History for {product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <FiX size={28} />
          </button>
        </div>
        <div className="mt-4">
          {/* The PriceHistoryChart needs to be adapted to fetch real data */}
          <p className="text-center text-gray-500">Price history chart will be displayed here.</p>
          {/* <PriceHistoryChart priceHistory={product.priceHistory} /> */}
        </div>
      </div>
    </div>
  );
};

export default PriceChartModal;
