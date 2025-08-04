
// src/components/AnnouncementBanner.js
// A banner to display the latest active announcement.

import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite/config';
import { DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID } from '../appwrite/constants';
import { Query } from 'appwrite';
import { FiGift, FiX } from 'react-icons/fi'; // CORRECTED: Replaced FiMegaphone with FiGift

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          ANNOUNCEMENTS_COLLECTION_ID,
          [
            Query.equal('isActive', true),
            Query.orderDesc('$createdAt'),
            Query.limit(1)
          ]
        );
        if (response.documents.length > 0) {
          setAnnouncement(response.documents[0]);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };
    fetchAnnouncement();
  }, []);

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="bg-green-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <FiGift className="mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{announcement.message}</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="p-1 rounded-full hover:bg-green-700">
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
