
// src/components/SkeletonLoader.js
// A reusable skeleton loader component for better perceived performance.

import React from 'react';

const SkeletonLoader = ({ className }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`}></div>
);

export default SkeletonLoader;
