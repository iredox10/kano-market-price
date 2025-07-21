
// src/components/WatchlistToast.js
// A toast notification for adding/removing items from the watchlist.

import React, { useEffect } from 'react';
import { FiHeart, FiCheckCircle } from 'react-icons/fi';

const WatchlistToast = ({ message, type, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2500); // The toast will disappear after 2.5 seconds

    return () => clearTimeout(timer);
  }, [onDone]);

  const isAdded = type === 'added';
  const bgColor = isAdded ? 'bg-green-600' : 'bg-red-600';
  const icon = isAdded ? <FiCheckCircle size={20} /> : <FiHeart size={20} />;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center px-6 py-3 rounded-full text-white shadow-lg z-50 animate-toast-in`}
      style={{ backgroundColor: isAdded ? '#16a34a' : '#dc2626' }}
    >
      <style>{`
        @keyframes toast-in {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-toast-in {
          animation: toast-in 0.5s ease-out forwards;
        }
      `}</style>
      {icon}
      <span className="font-semibold ml-3">{message}</span>
    </div>
  );
};

export default WatchlistToast;
