
// src/components/admin/AdminSidebar.js
// Sidebar navigation for the Admin Dashboard with functional logout.

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { account } from '../../appwrite/config'; // Import Appwrite account service
import { FiGrid, FiBriefcase, FiUserCheck, FiSettings, FiLogOut, FiClock, FiMap, FiTag } from 'react-icons/fi';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const linkClasses = "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors";
  const activeLinkClasses = "bg-red-600 text-white hover:bg-red-700 hover:text-white";

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      console.log('Admin logged out successfully');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="bg-white w-64 h-screen shadow-lg p-4 flex flex-col">
      <div className="text-2xl font-bold text-red-600 p-4 border-b">
        Admin Panel
      </div>
      <nav className="mt-6 flex-grow">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiGrid className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/verification-queue" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiClock className="mr-3" />
          Verification Queue
        </NavLink>
        <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase text-gray-500">Content</div>
        <NavLink to="/admin/manage-shops" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiBriefcase className="mr-3" />
          Manage Shops
        </NavLink>
        <NavLink to="/admin/manage-markets" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiMap className="mr-3" />
          Manage Markets
        </NavLink>
        <NavLink to="/admin/manage-categories" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiTag className="mr-3" />
          Manage Categories
        </NavLink>
        <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase text-gray-500">Users</div>
        <NavLink to="/admin/manage-users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiUserCheck className="mr-3" />
          Manage Users
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiSettings className="mr-3" />
          Settings
        </NavLink>
      </nav>
      <div className="mt-auto">
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
