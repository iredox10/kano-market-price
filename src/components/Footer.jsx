
// src/components/Footer.js
// The footer component for the bottom of every page.

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <p>&copy; {new Date().getFullYear()} Kano Price Checker. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <Link to="/about" className="hover:text-green-400">About Us</Link>
          <Link to="/privacy" className="hover:text-green-400">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-green-400">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
