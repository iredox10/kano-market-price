
// src/components/MainLayout.js
// A layout component to wrap all public-facing pages with the Header, Footer, and new BottomNav.

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import AnnouncementBanner from './AnnouncementBanner'; // Import the new banner

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBanner /> {/* Add the banner here */}
      <Header />
      <main className="flex-grow pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
