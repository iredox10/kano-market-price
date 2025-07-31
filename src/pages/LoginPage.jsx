
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { account, databases } from '../appwrite/config';
import { DATABASE_ID, USERS_COLLECTION_ID } from '../appwrite/constants';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import InfoModal from '../components/InfoModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get the setter function from the context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      const userDoc = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id
      );

      // --- THE FIX ---
      // 1. Manually update the global user state
      const fullUserData = { ...user, ...userDoc };
      setCurrentUser(fullUserData);

      // 2. Now, redirect based on the role
      switch (userDoc.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'shopOwner':
          navigate('/dashboard');
          break;
        default:
          navigate('/my-account');
          break;
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSent = (message) => {
    setInfoModal({ isOpen: true, title: 'Check Your Email', message, type: 'success' });
  };

  return (
    <>
      <InfoModal {...infoModal} onClose={() => setInfoModal({ isOpen: false })} />
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onEmailSent={handleEmailSent}
      />
      <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password" name="password" type="password" autoComplete="current-password" required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg flex items-center">
                <FiAlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end text-sm">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
