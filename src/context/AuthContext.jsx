
// src/context/AuthContext.js
// This context provides Appwrite authentication state to the entire application.

import React, { createContext, useState, useEffect, useContext } from 'react';
import { account, databases } from '../appwrite/config';
import { DATABASE_ID, USERS_COLLECTION_ID } from '../appwrite/constants';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        // If a session exists, get the user's full data from the database
        const userDoc = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          user.$id
        );
        // Combine the auth data with the database data (which includes their role, favorites, etc.)
        setCurrentUser({ ...user, ...userDoc });
      } catch (error) {
        // If no session is found, currentUser will be null
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const value = {
    currentUser,
    setCurrentUser, // We'll use this to update the state after login/logout
    loading,
  };

  // Don't render the app until the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
