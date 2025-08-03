
// src/pages/shopOwner/DashboardLayout.js
// A redesigned, mobile-first layout for the shop owner dashboard.

import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiSettings, FiUser } from 'react-icons/fi';

const Sidebar = () => (
  <div className="bg-white w-64 h-screen shadow-lg p-4 flex-col hidden lg:flex">
    <div className="text-2xl font-bold text-green-600 p-4 border-b">
      Owner Dashboard
    </div>
    <nav className="mt-6 flex-grow">
      <NavLink to="/dashboard/overview" className={({ isActive }) => `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'hover:bg-green-100'}`}>
        <FiGrid className="mr-3" /> Overview
      </NavLink>
      <NavLink to="/dashboard/products" className={({ isActive }) => `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'hover:bg-green-100'}`}>
        <FiPackage className="mr-3" /> My Products
      </NavLink>
      <NavLink to="/dashboard/settings" className={({ isActive }) => `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'hover:bg-green-100'}`}>
        <FiSettings className="mr-3" /> Shop Settings
      </NavLink>
    </nav>
    <div className="mt-auto pt-4 border-t">
      <NavLink to="/my-account" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-100">
        <FiUser className="mr-3" /> Switch to My Account
      </NavLink>
    </div>
  </div>
);

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard/overview', icon: <FiGrid size={24} />, label: 'Overview' },
    { path: '/dashboard/products', icon: <FiPackage size={24} />, label: 'Products' },
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
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 pb-20 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
