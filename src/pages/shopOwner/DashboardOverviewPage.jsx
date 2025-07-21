
// src/pages/shopOwner/DashboardOverviewPage.js
// The main overview/landing page for the shop owner dashboard.

import React from 'react';
import { FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`mr-4 p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


const DashboardOverviewPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FiPackage size={24} />}
          title="Total Products"
          value="12"
          color="green"
        />
        <StatCard
          icon={<FiDollarSign size={24} />}
          title="Total Sales (Month)"
          value="₦1,250,000"
          color="blue"
        />
        <StatCard
          icon={<FiUsers size={24} />}
          title="Community Engagements"
          value="87"
          color="purple"
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        {/* Placeholder for recent activity feed */}
        <p className="text-gray-600">No recent activity to show.</p>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
