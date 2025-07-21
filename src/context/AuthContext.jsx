
// src/context/AuthContext.js
// This context provides real-time authentication state to the entire application.

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import { auth, db } from '../firebase/config';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDocListener = null;

    // This listener runs whenever the user logs in or out
    const authStateListener = onAuthStateChanged(auth, (user) => {
      // If there was a previous user doc listener, unsubscribe from it
      if (userDocListener) {
        userDocListener();
      }

      if (user) {
        // User is signed in. Set up a REAL-TIME listener for their Firestore document.
        const userDocRef = doc(db, 'users', user.uid);
        userDocListener = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            // Combine Firebase auth data with Firestore data (like their role and favorites)
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            setCurrentUser(user);
          }
          setLoading(false);
        });
      } else {
        // User is signed out.
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Cleanup both listeners on unmount
    return () => {
      authStateListener();
      if (userDocListener) {
        userDocListener();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
  };

  // We don't render the app until the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
