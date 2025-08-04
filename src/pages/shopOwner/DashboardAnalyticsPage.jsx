import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiEye, FiHeart, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="mr-4 p-3 rounded-full bg-green-100 text-green-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

const DashboardAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal('shopOwnerId', currentUser.$id)]
        );
        setProducts(response.documents);
      } catch (error) {
        console.error("Failed to fetch products for analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentUser]);

  const summaryStats = useMemo(() => {
    const totalViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const totalWatchlistAdds = products.reduce((sum, p) => sum + (p.watchlistCount || 0), 0);
    return { totalViews, totalWatchlistAdds };
  }, [products]);

  const topViewedProducts = useMemo(() =>
    [...products].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5)
    , [products]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard icon={<FiEye size={24} />} title="Total Product Views" value={summaryStats.totalViews.toLocaleString()} loading={loading} />
        <StatCard icon={<FiHeart size={24} />} title="Total Watchlist Adds" value={summaryStats.totalWatchlistAdds.toLocaleString()} loading={loading} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FiBarChart2 className="mr-2" /> Most Viewed Products</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={topViewedProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => `${value.toLocaleString()} views`} />
              <Legend />
              <Bar dataKey="viewCount" name="Views" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FiAlertTriangle className="mr-2 text-yellow-500" /> Competitor Price Comparison</h3>
        <p className="text-gray-600">This feature is coming soon! It will show you how your prices compare to the anonymized community average for the same products.</p>
      </div>
    </div>
  );
};

export default DashboardAnalyticsPage;
