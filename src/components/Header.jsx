
// src/components/Header.js
// A simplified header, as mobile navigation is now handled by BottomNav.js.

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { account } from '../appwrite/config';
import { FiUser, FiGrid, FiLogOut, FiHeart, FiSearch, FiChevronDown } from 'react-icons/fi';

const UserMenu = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <FiUser className="text-gray-600" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-lg shadow-xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b">
            <p className="font-semibold text-gray-800">{currentUser.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
          </div>
          <nav className="py-2">
            <Link to="/my-account" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FiHeart className="mr-3 text-gray-500" /> My Account
            </Link>
            {currentUser.role === 'shopOwner' && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiGrid className="mr-3 text-gray-500" /> Shop Dashboard
              </Link>
            )}
            <div className="border-t my-2"></div>
            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FiLogOut className="mr-3 text-gray-500" /> Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};


const Header = () => {
  const { currentUser } = useAuth();

  const linkStyle = "relative text-gray-600 font-medium after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full";
  const activeLinkStyle = "relative text-green-600 font-bold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-green-600";

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Kano<span className="text-green-600">Price</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/products" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Products</NavLink>
            <NavLink to="/shops" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Shops</NavLink>
            <NavLink to="/markets" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Markets</NavLink>
          </nav>

          <div className="flex items-center space-x-5">
            {currentUser ? (
              <UserMenu />
            ) : (
              <Link to="/login" className="hidden sm:block text-sm text-gray-600 font-medium hover:text-green-600">
                Login / Sign Up
              </Link>
            )}
            <Link to="/contribute" className="hidden sm:inline-flex items-center bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md text-sm">
              Submit a Price
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
