
// src/components/MainLayout.js
// A layout component to wrap all public-facing pages with the Header, Footer, and new BottomNav.

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav'; // Import the new bottom navigation

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-20 lg:pb-0"> {/* Add padding for the bottom nav on mobile */}
        <Outlet />
      </main>
      <Footer />
      <BottomNav /> {/* Add the bottom navigation */}
    </div>
  );
};

export default MainLayout;
