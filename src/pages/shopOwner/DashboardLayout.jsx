
// src/pages/shopOwner/DashboardLayout.js
// Main layout for the shop owner dashboard, includes the sidebar.

import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './components/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
