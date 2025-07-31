
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { account } from '../appwrite/config';
import { FiLock, FiSave } from 'react-icons/fi';
import InfoModal from '../components/InfoModal';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  useEffect(() => {
    if (!userId || !secret) {
      setModalInfo({
        isOpen: true,
        title: 'Invalid Link',
        message: 'This password reset link is invalid or has expired. Please try again.',
        type: 'error'
      });
    }
  }, [userId, secret]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setModalInfo({ isOpen: true, title: 'Error', message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      await account.updateRecovery(userId, secret, password, confirmPassword);
      setModalInfo({
        isOpen: true,
        title: 'Success!',
        message: 'Your password has been reset successfully. You can now log in.',
        type: 'success'
      });
    } catch (err) {
      console.error("Error resetting password:", err);
      setModalInfo({
        isOpen: true,
        title: 'Reset Failed',
        message: 'This link may be expired or invalid. Please request a new one.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModalAndRedirect = () => {
    setModalInfo({ isOpen: false });
    if (modalInfo.type === 'success') {
      navigate('/login');
    }
  };

  return (
    <>
      <InfoModal {...modalInfo} onClose={closeModalAndRedirect} />
      <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Set a New Password
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="new-password" className="sr-only">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="new-password" name="password" type="password" required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirm-password" name="confirmPassword" type="password" required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || !userId || !secret}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                <FiSave className="mr-2" />
                {isLoading ? 'Saving...' : 'Save New Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
