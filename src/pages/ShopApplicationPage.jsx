
// src/pages/ShopApplicationPage.js
// A form for users to apply to become a shop owner, now integrated with Appwrite.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { databases } from '../appwrite/config';
import { DATABASE_ID, SHOP_APPLICATIONS_COLLECTION_ID } from '../appwrite/constants';
import { ID } from 'appwrite';
import { FiShoppingBag, FiTag, FiFileText, FiPhone, FiSend, FiMessageSquare, FiMapPin, FiClock } from 'react-icons/fi';
import { allMarkets } from '../data/mockData'; // We'll still use this for the dropdown
import InfoModal from '../components/InfoModal';

const ShopApplicationPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    market: '',
    speciality: '', // Corrected spelling to match Appwrite attribute
    phone: '',
    whatsapp: '',
    shopAddress: '',
    openingHours: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'You must be logged in to apply.', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      // Create a new document in the 'shopApplications' collection
      await databases.createDocument(
        DATABASE_ID,
        SHOP_APPLICATIONS_COLLECTION_ID,
        ID.unique(),
        {
          ...formData,
          userId: currentUser.$id,
          userEmail: currentUser.email,
          status: 'pending',
        }
      );

      setModalInfo({
        isOpen: true,
        title: 'Application Submitted!',
        message: 'Thank you. Your application has been received and is now under review.',
        type: 'success'
      });

    } catch (error) {
      console.error("Error submitting application: ", error);
      setModalInfo({ isOpen: true, title: 'Submission Failed', message: 'There was an error submitting your application. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModalAndRedirect = () => {
    setModalInfo({ isOpen: false });
    if (modalInfo.type === 'success') {
      navigate('/my-account');
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={closeModalAndRedirect} />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-800">Register Your Shop</h1>
              <p className="mt-3 text-lg text-gray-600">Complete the form below to apply to become a verified seller on KanoPrice.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                    <div className="relative">
                      <FiShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="shopName" id="shopName" value={formData.shopName} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">Shop Specialty</label>
                    <div className="relative">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      {/* Corrected name attribute to match state and Appwrite */}
                      <input type="text" name="speciality" id="speciality" value={formData.speciality} onChange={handleChange} required placeholder="e.g., Grains, Vegetables" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Primary Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="whatsapp" id="whatsapp" value={formData.whatsapp} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="market" className="block text-sm font-medium text-gray-700 mb-1">Market</label>
                  <select name="market" id="market" value={formData.market} onChange={handleChange} required className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="">Select a Market</option>
                    {allMarkets.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-1">Shop Address / Location Details</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                    <textarea name="shopAddress" id="shopAddress" rows="2" value={formData.shopAddress} onChange={handleChange} required placeholder="e.g., Stall C-15, First Floor, Grains Section" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                  </div>
                </div>
                <div>
                  <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="openingHours" id="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="e.g., Mon - Sat: 8:00 AM - 6:00 PM" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About Your Shop</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 text-gray-400" />
                    <textarea name="bio" id="bio" rows="4" value={formData.bio} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                  >
                    <FiSend className="mr-3" />
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopApplicationPage;
