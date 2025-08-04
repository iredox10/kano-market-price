
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import { FiTrendingDown, FiInbox } from 'react-icons/fi';

const OtherSellersTable = ({ productName, currentProductId }) => {
  const [otherSellers, setOtherSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productName || !currentProductId) return;

    const fetchOtherSellers = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [
            Query.equal('name', productName),
            Query.notEqual('$id', currentProductId)
          ]
        );
        // Sort by price, lowest first
        const sortedSellers = response.documents.sort((a, b) => a.ownerPrice - b.ownerPrice);
        setOtherSellers(sortedSellers);
      } catch (error) {
        console.error("Failed to fetch other sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherSellers();
  }, [productName, currentProductId]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Finding other sellers...</p>;
  }

  if (otherSellers.length === 0) {
    return (
      <div className="mt-8 text-center bg-gray-50 p-6 rounded-lg">
        <FiInbox className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">No other verified sellers have listed this product yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Compare Prices from Other Sellers</h3>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {otherSellers.map((product, index) => (
          <div key={product.$id} className="bg-white p-4 rounded-lg shadow-sm border">
            {index === 0 && (
              <div className="flex items-center text-sm font-bold text-green-600 mb-2">
                <FiTrendingDown className="mr-2" /> Best Alternative Price
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <Link to={`/shop/${product.shopOwnerId}`} className="font-bold text-blue-600 hover:underline">{product.shop}</Link>
                <p className="text-sm text-gray-500">{product.marketId}</p>
              </div>
              <p className="text-xl font-bold text-green-600">{`₦${product.ownerPrice.toLocaleString()}`}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">Shop Name</th>
              <th className="px-5 py-3 font-semibold">Market</th>
              <th className="px-5 py-3 font-semibold text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {otherSellers.map((product, index) => (
              <tr key={product.$id} className={`border-b border-gray-200 ${index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                <td className="px-5 py-4">
                  <Link to={`/shop/${product.shopOwnerId}`} className="text-gray-900 font-semibold hover:underline">{product.shop}</Link>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700">{product.marketId}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end">
                    {index === 0 && <FiTrendingDown className="text-green-600 mr-2" title="Best Alternative Price" />}
                    <p className="text-green-600 font-bold text-lg">{`₦${product.ownerPrice.toLocaleString()}`}</p>
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

export default OtherSellersTable;
