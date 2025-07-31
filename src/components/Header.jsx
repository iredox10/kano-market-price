import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook for Appwrite
import { account } from '../appwrite/config'; // Import Appwrite account service for signout
import { FiUser, FiMenu, FiX, FiGrid, FiLogOut, FiHeart, FiSearch, FiChevronDown } from 'react-icons/fi';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products, shops..."
        className="w-full h-11 pl-11 pr-4 bg-gray-100 border-transparent rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
      />
    </form>
  );
};

const UserMenu = () => {
  const { currentUser, setCurrentUser } = useAuth(); // Get user data and setter from context
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null); // Clear the user state in the context
      navigate('/'); // Redirect to home page after logout
      console.log("User logged out.");
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
            {currentUser.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiGrid className="mr-3 text-gray-500" /> Admin Dashboard
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAuth(); // Use the Appwrite auth context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const linkStyle = "relative text-gray-600 font-medium after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full";
  const activeLinkStyle = "relative text-green-600 font-bold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-green-600";


  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Kano<span className="text-green-600">Price</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-8">
                <NavLink to="/products" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Products</NavLink>
                <NavLink to="/shops" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Shops</NavLink>
                <NavLink to="/markets" className={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Markets</NavLink>
              </nav>
            </div>

            <div className="hidden lg:flex items-center space-x-5">
              {currentUser ? (
                <UserMenu />
              ) : (
                <Link to="/login" className="text-sm text-gray-600 font-medium hover:text-green-600">
                  Login / Sign Up
                </Link>
              )}
              <Link to="/contribute" className="bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md text-sm">
                Submit a Price
              </Link>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 flex flex-col transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex justify-between items-center p-4 border-b">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Kano<span className="text-green-600">Price</span>
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-700 p-2">
            <FiX size={28} />
          </button>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-6">
            <SearchBar />
          </div>
          <nav className="flex flex-col space-y-2 flex-grow">
            <NavLink to="/products" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">Products</NavLink>
            <NavLink to="/shops" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">Shops</NavLink>
            <NavLink to="/markets" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">Markets</NavLink>
          </nav>
          <div className="border-t pt-6 space-y-4">
            {currentUser ? (
              <>
                <Link to="/my-account" onClick={() => setIsMenuOpen(false)} className="flex items-center text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">
                  <FiUser className="mr-3" /> My Account
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">
                  <FiLogOut className="mr-3" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center text-lg text-gray-700 hover:bg-gray-100 p-3 rounded-md">
                <FiUser className="mr-3" /> Login / Sign Up
              </Link>
            )}
            <Link to="/contribute" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm">
              Submit a Price
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
