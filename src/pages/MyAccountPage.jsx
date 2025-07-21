
// src/pages/MyAccountPage.js
// A page for logged-in users to manage their account, now with a "Become a Seller" tab.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { myAccountData } from '../data/mockData';
import MyPriceWatchlist from '../components/MyPriceWatchlist';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiList, FiHeart, FiSave, FiLogOut, FiShoppingBag } from 'react-icons/fi';

// --- Sub-components for the tabs ---

const MyContributions = () => (
  <div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">My Price Contributions</h3>
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
            <th className="px-5 py-3 font-semibold">Product</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Market</th>
            <th className="px-5 py-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {myAccountData.contributions.map(item => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-5 py-4 text-gray-800 font-semibold">{item.productName}</td>
              <td className="px-5 py-4 text-green-600 font-bold">{`₦${item.price.toLocaleString()}`}</td>
              <td className="px-5 py-4 text-gray-700">{item.market}</td>
              <td className="px-5 py-4 text-gray-700">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating profile:', profile);
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h3>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" name="email" id="email" value={profile.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" />
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">
            <FiSave className="mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const BecomeASeller = () => (
  <div className="bg-white shadow-md rounded-lg p-8 text-center">
    <FiShoppingBag className="mx-auto h-16 w-16 text-green-500" />
    <h3 className="text-2xl font-bold text-gray-800 mt-4">Become a Verified Seller</h3>
    <p className="mt-2 text-gray-600 max-w-md mx-auto">
      Register your shop to list your products, reach more customers, and build trust within the community.
    </p>
    <Link
      to="/apply-to-sell"
      className="mt-6 inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 font-semibold text-lg"
    >
      Start Your Application
    </Link>
  </div>
);


// --- Main Page Component ---

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const { currentUser } = useAuth();

  const isShopOwner = currentUser?.role === 'shopOwner';

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 font-semibold rounded-lg transition-colors w-full text-left ${activeTab === id ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">My Account Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
              <TabButton id="watchlist" label="My Price Watchlist" icon={<FiHeart className="mr-3" />} />
              <TabButton id="contributions" label="My Contributions" icon={<FiList className="mr-3" />} />
              <TabButton id="settings" label="Profile Settings" icon={<FiUser className="mr-3" />} />
              {!isShopOwner && <TabButton id="become-seller" label="Become a Seller" icon={<FiShoppingBag className="mr-3" />} />}
              <button className="flex items-center px-4 py-3 font-semibold rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100">
                <FiLogOut className="mr-3" /> Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-3">
            {activeTab === 'watchlist' && <MyPriceWatchlist />}
            {activeTab === 'contributions' && <MyContributions />}
            {activeTab === 'settings' && <ProfileSettings />}
            {activeTab === 'become-seller' && <BecomeASeller />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
