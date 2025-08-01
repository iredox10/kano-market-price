
// src/pages/shopOwner/components/DashboardSidebar.js
// Sidebar navigation for the Shop Owner Dashboard with a link back to the user account.

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { account } from '../../../appwrite/config';
import { useAuth } from '../../../context/AuthContext';
import { FiGrid, FiPackage, FiPlusSquare, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const linkClasses = "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors";
  const activeLinkClasses = "bg-green-600 text-white hover:bg-green-700 hover:text-white";

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      console.log('Shop owner logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

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
      <div className="mt-auto pt-4 border-t">
        <NavLink to="/my-account" className={linkClasses}>
          <FiUser className="mr-3" />
          Switch to My Account
        </NavLink>
        <button onClick={handleLogout} className={`${linkClasses} w-full mt-2`}>
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
