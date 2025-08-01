import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRICE_HISTORY_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import { FiX } from 'react-icons/fi';
import PriceHistoryChart from './PriceHistoryChart';

const PriceChartModal = ({ isOpen, onClose, product }) => {
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && product) {
      const fetchPriceHistory = async () => {
        setLoading(true);
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            PRICE_HISTORY_COLLECTION_ID,
            [
              Query.equal('productid', product.$id),
              Query.orderDesc('updatedAt')
            ]
          );

          // Process the data for the chart component
          const historyData = {
            daily: response.documents.map(doc => ({
              date: new Date(doc.updatedAt).toLocaleDateString(),
              ownerPrice: doc.price,
            })),
            weekly: [], // Add weekly/monthly processing logic here if needed
            monthly: [],
          };
          setPriceHistory(historyData);

        } catch (error) {
          console.error("Failed to fetch price history:", error);
          setPriceHistory(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPriceHistory();
    }
  }, [isOpen, product]);

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
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading price history...</p>
          ) : (
            <PriceHistoryChart priceHistory={priceHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceChartModal;
