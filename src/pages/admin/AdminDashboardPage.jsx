
// src/pages/admin/AdminDashboardPage.js
// The main overview page for the admin dashboard, now with live Firestore data.

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FiBriefcase, FiUsers, FiClock } from 'react-icons/fi';

const AdminStatCard = ({ icon, title, value, color, loading }) => (
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

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalShops: 0, totalUsers: 0, pendingVerifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersQuery = query(collection(db, 'users'));
    const shopsQuery = query(collection(db, 'allShopOwners'), where('status', '==', 'Verified'));
    const pendingQuery = query(collection(db, 'shopApplications'), where('status', '==', 'pending'));

    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
      setLoading(false);
    });
    const unsubShops = onSnapshot(shopsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalShops: snapshot.size }));
      setLoading(false);
    });
    const unsubPending = onSnapshot(pendingQuery, (snapshot) => {
      setStats(prev => ({ ...prev, pendingVerifications: snapshot.size }));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubShops();
      unsubPending();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminStatCard
          icon={<FiBriefcase size={24} />}
          title="Total Verified Shops"
          value={stats.totalShops}
          color="red"
          loading={loading}
        />
        <AdminStatCard
          icon={<FiUsers size={24} />}
          title="Total Registered Users"
          value={stats.totalUsers}
          color="blue"
          loading={loading}
        />
        <AdminStatCard
          icon={<FiClock size={24} />}
          title="Pending Verifications"
          value={stats.pendingVerifications}
          color="yellow"
          loading={loading}
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Activity</h2>
        {/* In a real app, this would show a feed of recent signups, applications, etc. */}
        <p className="text-gray-600">Real-time analytics charts would be displayed here.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
