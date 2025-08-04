
// src/pages/shopOwner/DashboardLayout.js
// A redesigned, mobile-first layout for the shop owner dashboard.

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiGrid, FiPackage, FiSettings, FiUser, FiBarChart2 } from 'react-icons/fi';
import DashboardSidebar from './components/DashboardSidebar'; // Import the sidebar

const BottomNav = () => {
  const navItems = [
    { path: '/dashboard/overview', icon: <FiGrid size={24} />, label: 'Overview' },
    { path: '/dashboard/products', icon: <FiPackage size={24} />, label: 'Products' },
    // --- THE FIX ---
    { path: '/dashboard/analytics', icon: <FiBarChart2 size={24} />, label: 'Analytics' },
    { path: '/dashboard/settings', icon: <FiSettings size={24} />, label: 'Settings' },
    { path: '/my-account', icon: <FiUser size={24} />, label: 'Account' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center justify-center text-center w-full py-2 transition-colors ${isActive ? 'text-green-600' : 'text-gray-500'}`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-8 pb-20 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
