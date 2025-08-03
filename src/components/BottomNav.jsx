
// src/components/BottomNav.js
// A mobile-first bottom navigation bar for core pages.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiMap, FiPlusCircle } from 'react-icons/fi';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: <FiHome size={24} />, label: 'Home' },
    { path: '/products', icon: <FiPackage size={24} />, label: 'Products' },
    { path: '/contribute', icon: <FiPlusCircle size={32} className="text-white bg-green-600 rounded-full p-1 shadow-lg" />, label: 'Contribute' },
    { path: '/shops', icon: <FiShoppingBag size={24} />, label: 'Shops' },
    { path: '/markets', icon: <FiMap size={24} />, label: 'Markets' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center justify-center text-center w-full pt-2 pb-1 transition-colors ${isActive ? 'text-green-600' : 'text-gray-500'}`}
          >
            {item.icon}
            <span className={`text-xs mt-1 ${item.label === 'Contribute' ? 'font-bold text-green-600' : ''}`}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
