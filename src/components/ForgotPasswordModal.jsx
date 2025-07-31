
// src/components/ForgotPasswordModal.js
// A modal for handling the Appwrite password reset process.

import React, { useState } from 'react';
import { account } from '../appwrite/config'; // Import Appwrite account service
import { FiX, FiMail, FiSend } from 'react-icons/fi';

const ForgotPasswordModal = ({ isOpen, onClose, onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // The second argument is the URL the user will be sent to from their email.
      // Make sure this matches a route in your App.js
      const resetUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, resetUrl);

      onEmailSent(`A password reset link has been sent to ${email}. Please check your inbox.`);
      onClose();
    } catch (err) {
      console.error("Error sending password reset email:", err);
      setError("Could not send reset email. Please check if the address is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="text-gray-500 mt-1">Enter your email to receive a reset link.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <FiX size={28} />
          </button>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
          <div>
            <label htmlFor="reset-email" className="sr-only">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <FiSend className="mr-3" />
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
