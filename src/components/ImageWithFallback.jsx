
// src/components/ImageWithFallback.js
// A component that displays an image from Appwrite or a colored letter fallback.

import React, { useState, useEffect } from 'react';
import { storage } from '../appwrite/config';

const ImageWithFallback = ({ fileId, bucketId, fallbackText, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (fileId) {
      try {
        const result = storage.getFilePreview(bucketId, fileId);
        setImageUrl(result);
        setError(false);
      } catch (err) {
        console.error("Failed to get image preview:", err);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [fileId, bucketId]);

  const getInitials = (text) => {
    if (!text) return '?';
    return text.charAt(0).toUpperCase();
  };

  const getColorFromText = (text) => {
    if (!text) return 'bg-gray-500';
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  if (!imageUrl || error) {
    return (
      <div className={`${className} ${getColorFromText(fallbackText)} flex items-center justify-center`}>
        <span className="text-white font-bold text-2xl">{getInitials(fallbackText)}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={fallbackText}
      className={className}
      onError={() => setError(true)} // Fallback if the image URL is broken
    />
  );
};

export default ImageWithFallback;
