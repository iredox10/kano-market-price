
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
        const userDoc = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          user.$id
        );
        setCurrentUser({ ...user, ...userDoc });
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const value = {
    currentUser,
    setCurrentUser, // Expose the setter function
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
