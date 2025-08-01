
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { FiArrowUp, FiArrowDown, FiMinus, FiEye, FiTrash2, FiInbox, FiShoppingCart, FiTrendingDown, FiTag, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, USERS_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import PriceChartModal from './PriceChartModal';
import ImageWithFallback from './ImageWithFallback'; // Import the new component

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (current > previous) return <FiArrowUp className="text-orange-500" title={`Price increased from ₦${previous.toLocaleString()}`} />;
  if (current < previous) return <FiArrowDown className="text-green-500" title={`Price decreased from ₦${previous.toLocaleString()}`} />;
  return <FiMinus className="text-gray-400" title="Price is stable" />;
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
  const { currentUser, setCurrentUser } = useAuth();
  const [watchedProducts, setWatchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchWatchedProducts = async () => {
      const userWatchlist = (currentUser?.watchlist || []).map(item => JSON.parse(item));
      if (userWatchlist.length === 0) {
        setWatchedProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productIds = userWatchlist.map(item => item.productId);

        const response = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal('$id', productIds)]
        );

        const productsWithWatchData = response.documents.map(product => {
          const watchItem = userWatchlist.find(item => item.productId === product.$id);
          return { ...product, priceAtAdd: watchItem?.priceAtAdd };
        });

        setWatchedProducts(productsWithWatchData);

      } catch (error) {
        console.error("Failed to fetch favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedProducts();

  }, [currentUser]);

  const summaryStats = useMemo(() => {
    if (watchedProducts.length === 0) {
      return { totalValue: 0, priceDrops: 0 };
    }
    const totalValue = watchedProducts.reduce((sum, product) => {
      return sum + (product.ownerPrice || 0);
    }, 0);

    const priceDrops = watchedProducts.filter(p => p.ownerPrice < p.priceAtAdd).length;

    return { totalValue, priceDrops };
  }, [watchedProducts]);

  const handleUnfavorite = async (productId) => {
    if (!currentUser) return;

    const newWatchlistStrings = (currentUser.watchlist || []).filter(itemStr => {
      const item = JSON.parse(itemStr);
      return item.productId !== productId;
    });

    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        currentUser.$id,
        { watchlist: newWatchlistStrings }
      );
      setCurrentUser(prev => ({ ...prev, watchlist: newWatchlistStrings }));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) return <div className="text-center p-8"><p>Loading your watchlist...</p></div>;

  return (
    <>
      <PriceChartModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">My Price Watchlist</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard icon={<FiShoppingCart size={24} />} title="Items Tracked" value={watchedProducts.length} />
          <SummaryCard icon={<FiTag size={24} />} title="Total Value" value={`₦${summaryStats.totalValue.toLocaleString()}`} />
          <SummaryCard icon={<FiTrendingDown size={24} />} title="Recent Price Drops" value={summaryStats.priceDrops} colorClass="text-green-600" />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {watchedProducts.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Current Price</th>
                  <th className="px-5 py-3 font-semibold">Found At</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchedProducts.map(product => (
                  <tr key={product.$id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <ImageWithFallback
                          fileId={product.imageFileId}
                          bucketId={PRODUCT_IMAGES_BUCKET_ID}
                          fallbackText={product.name}
                          className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0"
                        />
                        <div>
                          <p className="text-gray-900 font-semibold">{product.name}</p>
                          <p className="text-gray-600 text-sm">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedProduct(product)} className="flex items-center text-left group">
                        <div className="text-gray-800 font-bold text-lg mr-2 group-hover:text-green-600">{`₦${(product.ownerPrice || 0).toLocaleString()}`}</div>
                        <PriceTrendIndicator current={product.ownerPrice} previous={product.priceAtAdd} />
                        <FiBarChart2 className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/shop/${product.shopOwnerId}`} className="text-blue-600 font-semibold hover:underline">
                        {product.shop}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button onClick={() => handleUnfavorite(product.$id)} className="text-red-500 hover:text-red-700" title="Remove from Watchlist">
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
    </>
  );
};

export default MyPriceWatchlist;
