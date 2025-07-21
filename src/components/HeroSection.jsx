
// src/components/HeroSection.js
// A redesigned, premium hero section with an interactive 3D parallax effect.

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBox, FiDroplet, FiFeather, FiGrid } from 'react-icons/fi';

const ProductOrb = ({ icon, name, delay }) => (
  <div
    className="relative group"
    style={{ animation: `orb-pop-in 0.5s ease-out ${delay}s forwards`, opacity: 0 }}
  >
    <div className="bg-white rounded-full w-20 h-20 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:bg-green-50">
      {icon}
    </div>
    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {name}
    </span>
  </div>
);

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const parallaxRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / (width / 2);
      const y = (e.clientY - top - height / 2) / (height / 2);

      // Adjust the rotation multiplier for a more subtle effect
      const rotateY = x * 10;
      const rotateX = -y * 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const parent = el.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb-pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .shelf {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: translateZ(-20px);
        }
      `}</style>
      <div className="relative overflow-hidden bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20 md:py-28">
            {/* Left Column: Text and Search */}
            <div className="text-center lg:text-left z-10" style={{ animation: 'revealUp 1s ease-out forwards' }}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Know The Price, <br />
                <span className="text-green-600">Before You Go.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                We track daily prices on thousands of products across all major Kano markets, so you can stop guessing and start saving.
              </p>

              <form onSubmit={handleSearch} className="mt-10 max-w-lg mx-auto lg:mx-0">
                <div className="relative">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for any product..."
                    className="w-full h-16 pl-14 pr-4 rounded-full text-lg text-gray-800 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white h-12 px-8 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center text-base transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Interactive 3D Visual */}
            <div className="hidden lg:block" style={{ transformStyle: 'preserve-3d' }}>
              <div ref={parallaxRef} className="relative space-y-4 transition-transform duration-100 ease-out">
                {/* Shelf 1 */}
                <div className="shelf rounded-2xl p-4 flex justify-around shadow-xl">
                  <ProductOrb icon={<FiBox size={32} className="text-green-500" />} name="Grains" delay={0.2} />
                  <ProductOrb icon={<FiDroplet size={32} className="text-blue-500" />} name="Oils" delay={0.4} />
                  <ProductOrb icon={<FiFeather size={32} className="text-yellow-500" />} name="Vegetables" delay={0.6} />
                </div>
                {/* Shelf 2 */}
                <div className="shelf rounded-2xl p-4 flex justify-around shadow-xl">
                  <ProductOrb icon={<FiGrid size={32} className="text-red-500" />} name="Tubers" delay={0.8} />
                  <ProductOrb icon={<FiBox size={32} className="text-purple-500" />} name="Spices" delay={1.0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
