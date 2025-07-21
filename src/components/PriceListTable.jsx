
// src/components/PriceListTable.js
// Displays a table of product prices, now accepting a pre-processed list.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiArrowUp, FiArrowDown, FiMinus, FiChevronDown, FiChevronUp, FiAward } from 'react-icons/fi';
import PriceHistoryChart from './PriceHistoryChart';

const StockStatusBadge = ({ status }) => {
  const colorClasses = {
    'In Stock': 'bg-green-100 text-green-800',
    'Low Stock': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (current > previous) return <FiArrowUp className="text-orange-500" title="Price increased" />;
  if (current < previous) return <FiArrowDown className="text-green-500" title="Price decreased" />;
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const PriceListTable = ({ products: priceEntries }) => { // Renamed prop for clarity
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
            <th className="px-5 py-3 font-semibold">Product</th>
            <th className="px-5 py-3 font-semibold text-right">Price</th>
            <th className="px-5 py-3 font-semibold">Source</th>
            <th className="px-5 py-3 font-semibold">Stock</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 font-semibold text-center">Chart</th>
          </tr>
        </thead>
        <tbody>
          {priceEntries.map((entry) => (
            <React.Fragment key={entry.uniqueId}>
              <tr className={`border-b border-gray-200 hover:bg-gray-50 ${entry.bestPrice ? 'bg-green-50' : ''}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <img src={entry.productImage} alt={entry.productName} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                    <Link to={`/product/${entry.productId}`} className="text-gray-900 font-semibold whitespace-no-wrap hover:text-green-600">
                      {entry.productName}
                    </Link>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end">
                    {entry.bestPrice && <FiAward className="text-yellow-500 mr-2" title="Best Price" />}
                    <p className="text-green-600 font-bold text-lg whitespace-no-wrap mr-2">
                      {`₦${entry.price.toLocaleString()}`}
                    </p>
                    {entry.sourceType === 'Shop Owner' && <PriceTrendIndicator current={entry.price} previous={entry.previousPrice} />}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    {entry.sourceType === 'Shop Owner' ? <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> : <FiUsers className="text-blue-500 mr-2 flex-shrink-0" />}
                    <div>
                      {entry.sourceType === 'Shop Owner' && entry.sourceId ? (
                        <Link to={`/shop/${entry.sourceId}`} className="text-gray-900 font-semibold hover:text-green-600 hover:underline">{entry.sourceName}</Link>
                      ) : (
                        <p className="text-gray-900 font-semibold">{entry.sourceName}</p>
                      )}
                      {entry.market !== 'Various' ? (
                        <Link to={`/market/${entry.market.replace(/\s+/g, '-')}`} className="text-gray-600 text-sm hover:text-green-600 hover:underline">
                          {entry.market}
                        </Link>
                      ) : (
                        <p className="text-gray-600 text-sm">{entry.market}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {entry.stockStatus ? <StockStatusBadge status={entry.stockStatus} /> : <span className="text-gray-500">-</span>}
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{entry.date.toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <button onClick={() => toggleRow(entry.uniqueId)} className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-gray-100">
                    {expandedRow === entry.uniqueId ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                </td>
              </tr>
              {expandedRow === entry.uniqueId && (
                <tr className="bg-gray-50">
                  <td colSpan="6" className="p-4">
                    <PriceHistoryChart priceHistory={entry.priceHistory} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListTable;
