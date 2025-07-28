
// src/components/MyPriceWatchlist.js
// A powerful component for users to track their favorite products, now with a total value summary.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FiArrowUp, FiArrowDown, FiMinus, FiEye, FiTrash2, FiInbox, FiShoppingCart, FiTrendingDown, FiTag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { allProducts } from '../data/mockData'; // Import allProducts from mockData

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (current > previous) return <FiArrowUp className="text-orange-500" title="Price increased" />;
  if (current < previous) return <FiArrowDown className="text-green-500" title="Price decreased" />;
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const SummaryCard = ({ icon, title, value, colorClass }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center">
      <div className={`mr-4 text-gray-500`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${colorClass || 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  </div>
);

const MyPriceWatchlist = () => {
  const { currentUser } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (currentUser?.favoriteProductIds && currentUser.favoriteProductIds.length > 0) {
      const favs = allProducts.filter(p => currentUser.favoriteProductIds.includes(p.id));
      setFavoriteProducts(favs);
    } else {
      setFavoriteProducts([]);
    }
    setLoading(false);
  }, [currentUser]);

  const summaryStats = useMemo(() => {
    if (favoriteProducts.length === 0) {
      return { totalValue: 0, priceDrops: 0 };
    }
    const totalValue = favoriteProducts.reduce((sum, product) => {
      return sum + (product.currentPrice?.owner || 0);
    }, 0);
    const priceDrops = favoriteProducts.filter(p => p.currentPrice.owner < p.currentPrice.previousOwnerPrice).length;

    return { totalValue, priceDrops };
  }, [favoriteProducts]);

  const handleUnfavorite = async (productId) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        favoriteProductIds: arrayRemove(productId)
      });
      console.log(`Product ${productId} removed from favorites.`);
    } catch (error) {
      console.error("Error removing favorite: ", error);
    }
  };

  if (loading) return <div className="text-center p-8"><p>Loading your watchlist...</p></div>;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">My Price Watchlist</h3>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={<FiShoppingCart size={24} />} title="Items Tracked" value={favoriteProducts.length} />
        <SummaryCard icon={<FiTag size={24} />} title="Total Value" value={`₦${summaryStats.totalValue.toLocaleString()}`} />
        <SummaryCard icon={<FiTrendingDown size={24} />} title="Recent Price Drops" value={summaryStats.priceDrops} colorClass="text-green-600" />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {favoriteProducts.length > 0 ? (
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
                      <button onClick={() => handleUnfavorite(product.id)} className="text-red-500 hover:text-red-700" title="Remove from Watchlist">
                        <FiTrash2 size={20} />
                      </button>
                      <Link to={`/search?q=${encodeURIComponent(product.name)}`} className="text-gray-500 hover:text-blue-600" title="View All Prices">
                        <FiEye size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-12">
            <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">You haven't added any products to your watchlist yet.</p>
            <Link to="/products" className="mt-2 inline-block text-green-600 font-semibold hover:underline">Browse products to add</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPriceWatchlist;
