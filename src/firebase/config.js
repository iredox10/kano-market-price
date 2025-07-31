// src/firebase/config.js
// This file initializes Firebase and exports all the necessary services for the app.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions"; // Import getFunctions

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmroOjrZELqgSr-yBcWSH5J0ijRyJ2cf8",
  authDomain: "kano-price.firebaseapp.com",
  projectId: "kano-price",
  storageBucket: "kano-price.appspot.com", // Corrected storage bucket format
  messagingSenderId: "128105475780",
  appId: "1:128105475780:web:6aa1622331dfb81b3ae391",
  measurementId: "G-CE0CSS8FNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app); // Initialize and export functions

export default app;
