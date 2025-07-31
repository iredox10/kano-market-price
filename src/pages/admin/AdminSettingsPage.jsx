
// src/pages/admin/AdminSettingsPage.js
// A page for the admin to manage their profile and platform settings.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { account, databases } from '../../appwrite/config';
import { DATABASE_ID, USERS_COLLECTION_ID } from '../../appwrite/constants';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'; // This is Firebase, should be Appwrite
import { FiUser, FiLock, FiSave, FiSettings } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';

const AdminSettingsPage = () => {
  const { currentUser, setCurrentUser } = useAuth();
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
      await account.updateName(profile.name);
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        currentUser.$id,
        { name: profile.name }
      );
      setCurrentUser(prev => ({ ...prev, name: profile.name }));
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
    setIsLoading(true);
    try {
      await account.updatePassword(password.new, password.current);
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
        <div className="flex items-center mb-6">
          <FiSettings className="text-2xl text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Profile Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <FiUser className="text-xl text-gray-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={profile.name} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={profile.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500" />
              </div>
              <div className="text-right">
                <button type="submit" disabled={isLoading} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400">
                  <FiSave className="mr-2" /> Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <FiLock className="text-xl text-gray-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" name="current" id="current" value={password.current} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="new" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" name="new" id="new" value={password.new} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" name="confirm" id="confirm" value={password.confirm} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div className="text-right">
                <button type="submit" disabled={isLoading} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400">
                  <FiSave className="mr-2" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
