
// src/pages/admin/ManageAnnouncementsPage.js
// A page for admins to create and manage platform-wide announcements.

import React, { useState, useEffect } from 'react';
import { databases } from '../../appwrite/config';
import { DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID } from '../../appwrite/constants';
import { ID, Query } from 'appwrite';
import { FiVolume2, FiPlus, FiTrash2 } from 'react-icons/fi'; // CORRECTED: Replaced FiMegaphone
import InfoModal from '../../components/InfoModal';

const ManageAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        [Query.orderDesc('$createdAt')]
      );
      setAnnouncements(response.documents);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        ID.unique(),
        {
          message: newMessage,
          isActive: true,
        }
      );
      setNewMessage('');
      fetchAnnouncements();
      setModalInfo({ isOpen: true, title: 'Success', message: 'New announcement has been posted.', type: 'success' });
    } catch (error) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Failed to post announcement.', type: 'error' });
    }
  };

  const handleDelete = async (announcementId) => {
    try {
      await databases.deleteDocument(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, announcementId);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={() => setModalInfo({ isOpen: false })} />
      <div>
        <div className="flex items-center mb-6">
          <FiVolume2 className="text-2xl text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Manage Announcements</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Announcement</h3>
          <form onSubmit={handleAddAnnouncement} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              <FiPlus className="mr-2" /> Post
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 p-4 border-b">Past Announcements</h3>
          {loading ? <p className="p-4">Loading...</p> : (
            <ul className="divide-y">
              {announcements.map(ann => (
                <li key={ann.$id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800">{ann.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(ann.$createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(ann.$id)} className="text-red-500 hover:text-red-700" title="Delete">
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageAnnouncementsPage;
