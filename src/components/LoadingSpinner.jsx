
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
