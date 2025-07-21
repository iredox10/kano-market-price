
// src/pages/MyAccountPage.js
// A page for logged-in users to manage their account, now fully integrated with Firebase.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import MyPriceWatchlist from '../components/MyPriceWatchlist';
import BecomeASeller from '../components/BecomeASeller';
import { FiUser, FiList, FiHeart, FiSave, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import InfoModal from '../components/InfoModal';

// --- Sub-components for the tabs ---

const MyContributions = ({ userId }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    };

    const q = query(collection(db, "priceContributions"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userContributions = [];
      querySnapshot.forEach((doc) => {
        userContributions.push({ id: doc.id, ...doc.data() });
      });
      setContributions(userContributions);
      setLoading(false);
    });

    return () => unsubscribe();
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
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-4 text-gray-800 font-semibold">{item.productName}</td>
                  <td className="px-5 py-4 text-green-600 font-bold">{`₦${item.price.toLocaleString()}`}</td>
                  <td className="px-5 py-4 text-gray-700">{item.marketName}</td>
                  <td className="px-5 py-4 text-gray-700">{item.submittedAt?.toDate().toLocaleDateString()}</td>
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
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (currentUser) {
      setProfile({ name: currentUser.name || '', email: currentUser.email || '' });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { name: profile.name });
      setModalInfo({ isOpen: true, title: 'Success', message: 'Your profile has been updated.', type: 'success' });
    } catch (error) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (!password.current) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Please enter your current password.', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password.new);
      setModalInfo({ isOpen: true, title: 'Success', message: 'Your password has been changed successfully.', type: 'success' });
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Failed to change password. Please check your current password.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h3>
        <form onSubmit={handleProfileSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6 mb-8">
          {/* ... Profile fields ... */}
        </form>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* ... Password fields ... */}
        </form>
      </div>
    </>
  );
};


// --- Main Page Component ---

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isShopOwner = currentUser?.role === 'shopOwner';

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
              {!isShopOwner && <TabButton id="become-seller" label="Become a Seller" icon={<FiShoppingBag className="mr-3" />} />}
              <button onClick={handleLogout} className="flex items-center px-4 py-3 font-semibold rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100">
                <FiLogOut className="mr-3" /> Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-3">
            {activeTab === 'watchlist' && <MyPriceWatchlist userId={currentUser?.uid} />}
            {activeTab === 'contributions' && <MyContributions userId={currentUser?.uid} />}
            {activeTab === 'settings' && <ProfileSettings />}
            {activeTab === 'become-seller' && <BecomeASeller />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
