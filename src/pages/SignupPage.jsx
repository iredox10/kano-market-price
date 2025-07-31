
// src/pages/SignupPage.js
// Provides a form for new users to register using Appwrite.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { account, databases } from '../appwrite/config'; // Import Appwrite services
import { ID } from 'appwrite';
import { DATABASE_ID, USERS_COLLECTION_ID } from '../appwrite/constants'; // Import your Appwrite constants
import InfoModal from '../components/InfoModal';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setModalInfo({ isOpen: false });
    setIsLoading(true);

    try {
      // Step 1: Create the user in Appwrite Auth
      const user = await account.create(ID.unique(), email, password, name);

      // Step 2: Create a corresponding document in the 'users' collection
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id, // Use the user's Appwrite ID as the document ID
        {
          name: name,
          email: email,
          role: 'user', // Assign a default role
          favoriteProductIds: [], // Initialize with an empty array
        }
      );

      setModalInfo({
        isOpen: true,
        title: 'Account Created!',
        message: 'Your account has been created successfully. Please log in to continue.',
        type: 'success'
      });

    } catch (err) {
      console.error("Error signing up:", err);
      setModalInfo({
        isOpen: true,
        title: 'Signup Failed',
        message: err.message,
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
              Create a new account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name" name="name" type="text" autoComplete="name" required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password" name="password" type="password" autoComplete="new-password" required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password (at least 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
