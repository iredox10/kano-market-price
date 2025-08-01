
// src/pages/shopOwner/DashboardOverviewPage.js
// The main overview page for the shop owner dashboard, with live Appwrite data.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`mr-4 p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
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


const DashboardOverviewPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchStats = async () => {
      try {
        const productsRes = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal('shopOwnerId', currentUser.$id), Query.limit(1)]
        );
        setStats({ totalProducts: productsRes.total });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FiPackage size={24} />}
          title="Total Products Listed"
          value={stats.totalProducts}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={<FiDollarSign size={24} />}
          title="Total Sales (Month)"
          value="Coming Soon"
          color="blue"
          loading={false}
        />
        <StatCard
          icon={<FiUsers size={24} />}
          title="Community Engagements"
          value="Coming Soon"
          color="purple"
          loading={false}
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-600">A feed of recent inquiries and price updates will be shown here.</p>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
