
// src/pages/MyAccountPage.js
// A page for logged-in users to manage their account, with a link to the owner dashboard if applicable.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { databases, account } from '../appwrite/config';
import { DATABASE_ID, USERS_COLLECTION_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import { useAuth } from '../context/AuthContext';
import MyPriceWatchlist from '../components/MyPriceWatchlist';
import BecomeASeller from '../components/BecomeASeller';
import { FiUser, FiList, FiHeart, FiSave, FiLogOut, FiShoppingBag, FiGrid } from 'react-icons/fi';
import InfoModal from '../components/InfoModal';

// --- Sub-components for the tabs ---

const MyContributions = ({ userId }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchContributions = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PRICE_CONTRIBUTIONS_COLLECTION_ID,
          [Query.equal('userId', userId)]
        );
        setContributions(response.documents);
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [userId]);

  if (loading) return <div className="text-center p-8"><p>Loading your contributions...</p></div>;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">My Price Contributions</h3>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {contributions.length > 0 ? (
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
              {contributions.map(item => (
                <tr key={item.$id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-4 text-gray-800 font-semibold">{item.productName}</td>
                  <td className="px-5 py-4 text-green-600 font-bold">{`₦${item.price.toLocaleString()}`}</td>
                  <td className="px-5 py-4 text-gray-700">{item.marketName}</td>
                  <td className="px-5 py-4 text-gray-700">{new Date(item.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-12">
            <p className="text-gray-600">You haven't contributed any prices yet.</p>
            <Link to="/contribute" className="mt-4 inline-block text-green-600 font-semibold hover:underline">Contribute your first price</Link>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
    }
  }, [currentUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await account.updateName(name);
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        currentUser.$id,
        { name }
      );
      setCurrentUser(prev => ({ ...prev, name }));
      setModalInfo({ isOpen: true, title: 'Success', message: 'Your profile has been updated.', type: 'success' });
    } catch (error) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h3>
        <form onSubmit={handleProfileSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" value={currentUser?.email || ''} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500" />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isLoading} className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400">
              <FiSave className="mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};


// --- Main Page Component ---

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const isShopOwner = currentUser?.role === 'shopOwner';

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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

              {/* --- THE FIX --- */}
              {isShopOwner ? (
                <Link to="/dashboard" className="flex items-center px-4 py-3 font-semibold rounded-lg text-gray-600 hover:bg-gray-100">
                  <FiGrid className="mr-3" /> Switch to Dashboard
                </Link>
              ) : (
                <TabButton id="become-seller" label="Become a Seller" icon={<FiShoppingBag className="mr-3" />} />
              )}

              <button onClick={handleLogout} className="flex items-center px-4 py-3 font-semibold rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100">
                <FiLogOut className="mr-3" /> Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-3">
            {activeTab === 'watchlist' && <MyPriceWatchlist />}
            {activeTab === 'contributions' && <MyContributions userId={currentUser?.$id} />}
            {activeTab === 'settings' && <ProfileSettings />}
            {activeTab === 'become-seller' && <BecomeASeller />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
