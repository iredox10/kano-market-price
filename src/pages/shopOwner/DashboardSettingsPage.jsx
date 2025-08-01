
// src/pages/shopOwner/DashboardSettingsPage.js
// A complete page for shop owners to update their info, powered by Appwrite.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, SHOP_OWNERS_COLLECTION_ID } from '../../appwrite/constants';
import { FiShoppingBag, FiSave, FiTag, FiFileText, FiPhone, FiMessageSquare, FiClock } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';

const DashboardSettingsPage = () => {
  const { currentUser } = useAuth();
  const [shopInfo, setShopInfo] = useState({
    name: '',
    specialty: '',
    bio: '',
    phone: '',
    whatsapp: '',
    openingHours: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (currentUser) {
      const fetchShopInfo = async () => {
        try {
          const doc = await databases.getDocument(
            DATABASE_ID,
            SHOP_OWNERS_COLLECTION_ID,
            currentUser.$id
          );
          setShopInfo({
            name: doc.name || '',
            specialty: doc.specialty || '',
            bio: doc.bio || '',
            phone: doc.phone || '',
            whatsapp: doc.whatsapp || '',
            openingHours: doc.openingHours || '',
          });
        } catch (error) {
          console.error("Failed to fetch shop info:", error);
          setModalInfo({ isOpen: true, title: 'Error', message: 'Could not load your shop information.', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchShopInfo();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setShopInfo({ ...shopInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await databases.updateDocument(
        DATABASE_ID,
        SHOP_OWNERS_COLLECTION_ID,
        currentUser.$id,
        shopInfo
      );
      setModalInfo({ isOpen: true, title: 'Success!', message: 'Your shop information has been updated.', type: 'success' });
    } catch (error) {
      console.error("Error updating shop info:", error);
      setModalInfo({ isOpen: true, title: 'Update Failed', message: 'There was an error saving your information.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading settings...</p>;

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop Settings</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
          <div className="flex items-center mb-6">
            <FiShoppingBag className="text-2xl text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Shop Information</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input type="text" name="name" id="name" value={shopInfo.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input type="text" name="specialty" id="specialty" value={shopInfo.specialty} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={shopInfo.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input type="tel" name="whatsapp" id="whatsapp" value={shopInfo.whatsapp} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <input type="text" name="openingHours" id="openingHours" value={shopInfo.openingHours} onChange={handleChange} placeholder="e.g., Mon - Sat: 8am - 6pm" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About Your Shop</label>
              <textarea name="bio" id="bio" rows="4" value={shopInfo.bio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div className="text-right pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400"
              >
                <FiSave className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardSettingsPage;
