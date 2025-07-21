
// src/components/MainLayout.js
// A layout component to wrap all public-facing pages with the Header and Footer.

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Child routes (the actual pages) will be rendered here */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
