
// src/components/ContactShopModal.js
// A modal to display shop owner contact details.

import React from 'react';
import { FiX, FiPhone, FiMessageSquare } from 'react-icons/fi';

const ContactShopModal = ({ isOpen, onClose, shop }) => {
  if (!isOpen || !shop) {
    return null;
  }

  const whatsappLink = `https://wa.me/${shop.whatsapp}`;
  const callLink = `tel:${shop.phone}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact {shop.name}</h2>
            <p className="text-gray-500">Reach out to make an order or inquiry.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <FiX size={28} />
          </button>
        </div>
        <div className="space-y-4 mt-6">
          <a
            href={callLink}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            <FiPhone className="mr-3" />
            Call Now ({shop.phone})
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            <FiMessageSquare className="mr-3" />
            Send a WhatsApp Message
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactShopModal;
