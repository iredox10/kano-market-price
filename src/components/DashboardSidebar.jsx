
// src/pages/shopOwner/components/DashboardSidebar.js
// Sidebar navigation for the Shop Owner Dashboard.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiPackage, FiPlusSquare, FiSettings, FiLogOut } from 'react-icons/fi';

const DashboardSidebar = () => {
  const linkClasses = "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors";
  const activeLinkClasses = "bg-green-600 text-white hover:bg-green-700 hover:text-white";

  return (
    <div className="bg-white w-64 h-screen shadow-lg p-4 flex flex-col">
      <div className="text-2xl font-bold text-green-600 p-4 border-b">
        Owner Dashboard
      </div>
      <nav className="mt-6 flex-grow">
        <NavLink to="/dashboard/overview" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiGrid className="mr-3" />
          Overview
        </NavLink>
        <NavLink to="/dashboard/products" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiPackage className="mr-3" />
          My Products
        </NavLink>
        <NavLink to="/dashboard/add-product" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiPlusSquare className="mr-3" />
          Add New Product
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiSettings className="mr-3" />
          Shop Settings
        </NavLink>
      </nav>
      <div className="mt-auto">
        <button className={`${linkClasses} w-full`}>
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
