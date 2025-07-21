
// src/components/InfoModal.js
// A reusable modal for displaying success or error messages.

import React from 'react';
import { FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const InfoModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) {
    return null;
  }

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const buttonColor = isSuccess ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center transform transition-all">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          {isSuccess ? <FiCheckCircle className={`h-6 w-6 ${iconColor}`} /> : <FiAlertTriangle className={`h-6 w-6 ${iconColor}`} />}
        </div>
        <h3 className="text-lg leading-6 font-bold text-gray-900">{title}</h3>
        <div className="mt-2 px-4 text-sm">
          <p className="text-gray-500">{message}</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
