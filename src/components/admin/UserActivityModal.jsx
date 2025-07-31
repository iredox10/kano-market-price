import React, { useState, useEffect } from 'react';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, PRICE_CONTRIBUTIONS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiX, FiList } from 'react-icons/fi';

const UserActivityModal = ({ isOpen, onClose, user }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      const fetchContributions = async () => {
        setLoading(true);
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            PRICE_CONTRIBUTIONS_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          );
          setContributions(response.documents);
        } catch (error) {
          console.error("Failed to fetch user contributions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchContributions();
    }
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity for {user.name}</h2>
            <p className="text-gray-500 mt-1">A log of their recent price contributions.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <FiX size={28} />
          </button>
        </div>
        <div className="mt-6 max-h-80 overflow-y-auto">
          {loading ? (
            <p>Loading activity...</p>
          ) : contributions.length > 0 ? (
            <ul className="space-y-3">
              {contributions.map(item => (
                <li key={item.$id} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-800">{item.productName}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Price: <span className="font-bold text-green-600">₦{item.price.toLocaleString()}</span></span>
                    <span>{new Date(item.$createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <FiList className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">This user has not made any contributions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityModal;
