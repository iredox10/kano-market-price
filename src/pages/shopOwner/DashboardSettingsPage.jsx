
// src/pages/shopOwner/DashboardSettingsPage.js
// Page for shop owners to update their shop and profile information.

import React, { useState } from 'react';
import { FiShoppingBag, FiUser, FiSave } from 'react-icons/fi';

const DashboardSettingsPage = () => {
  // In a real app, you'd fetch this data from your backend
  const [shopInfo, setShopInfo] = useState({
    name: 'Adamu & Sons',
    specialty: 'Grains & Cereals',
    description: 'Your one-stop shop for all local and foreign grains. We pride ourselves on quality and affordability.'
  });

  const [ownerInfo, setOwnerInfo] = useState({
    name: 'Adamu Bako',
    email: 'adamu.bako@example.com'
  });

  const handleShopInfoChange = (e) => {
    const { name, value } = e.target;
    setShopInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerInfoChange = (e) => {
    const { name, value } = e.target;
    setOwnerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShopInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Shop Info:", shopInfo);
    // Add logic to save to backend
  };

  const handleOwnerInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Owner Info:", ownerInfo);
    // Add logic to save to backend
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop Settings</h1>

      {/* Shop Information Form */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-6">
          <FiShoppingBag className="text-2xl text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Shop Information</h2>
        </div>
        <form onSubmit={handleShopInfoSubmit} className="space-y-6">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
            <input
              type="text"
              id="shopName"
              name="name"
              value={shopInfo.name}
              onChange={handleShopInfoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={shopInfo.specialty}
              onChange={handleShopInfoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., Fresh Vegetables, Grains"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Shop Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={shopInfo.description}
              onChange={handleShopInfoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FiSave className="mr-2" />
              Save Shop Info
            </button>
          </div>
        </form>
      </div>

      {/* Owner Information Form */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FiUser className="text-2xl text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Owner Profile</h2>
        </div>
        <form onSubmit={handleOwnerInfoSubmit} className="space-y-6">
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="ownerName"
              name="name"
              value={ownerInfo.name}
              onChange={handleOwnerInfoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              id="ownerEmail"
              name="email"
              value={ownerInfo.email}
              onChange={handleOwnerInfoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FiSave className="mr-2" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
