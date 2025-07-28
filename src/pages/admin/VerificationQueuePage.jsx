
// src/pages/admin/VerificationQueuePage.js
// A dedicated page for admins to approve or reject new shop owner applications from Firestore.

import React, { useState, useEffect } from 'react';
import { db, functions } from '../../firebase/config'; // Import functions from your config
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { FiCheck, FiX, FiClock, FiMail, FiPhone } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';

const VerificationQueuePage = () => {
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null); // Track which item is being processed
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    const q = query(collection(db, "shopApplications"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applications = [];
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() });
      });
      setPendingShops(applications);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (applicationId, userId) => {
    setIsProcessing(applicationId);
    // This is the correct way to call an 'onCall' Cloud Function
    const approveShop = httpsCallable(functions, 'approveShopApplication');

    try {
      const result = await approveShop({ applicationId, userId });
      console.log(result.data.message);
      setModalInfo({ isOpen: true, title: 'Success', message: result.data.message, type: 'success' });
    } catch (error) {
      console.error("Error approving shop:", error);
      setModalInfo({ isOpen: true, title: 'Error', message: error.message, type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = (applicationId) => {
    // This would also trigger a backend function to update the application status to 'rejected'.
    console.log(`Triggering rejection for application: ${applicationId}`);
    alert(`Rejection function would be called for application ${applicationId}.`);
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <div className="flex items-center mb-6">
          <FiClock className="text-2xl text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Shop Verification Queue</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-12 text-center text-gray-500">Loading applications...</p>
          ) : pendingShops.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="px-5 py-3 font-semibold">Shop Name</th>
                  <th className="px-5 py-3 font-semibold">Market</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingShops.map(shop => (
                  <tr key={shop.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-gray-900 font-semibold whitespace-no-wrap">{shop.shopName}</p>
                        <p className="text-gray-600 text-sm whitespace-no-wrap">{shop.specialty}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700 whitespace-no-wrap">{shop.market}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <FiMail className="mr-2 text-gray-500" /> {shop.userEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FiPhone className="mr-2 text-gray-500" /> {shop.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleApprove(shop.id, shop.userId)}
                          disabled={isProcessing === shop.id}
                          className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-green-300"
                          title="Approve Shop"
                        >
                          <FiCheck className="mr-2" /> {isProcessing === shop.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(shop.id)}
                          disabled={isProcessing === shop.id}
                          className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-red-300"
                          title="Reject Shop"
                        >
                          <FiX className="mr-2" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-12">
              <p className="text-lg text-gray-600">The verification queue is empty.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationQueuePage;
