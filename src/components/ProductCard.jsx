
// src/components/ProductCard.js
// A reusable card with a functional favorite toggle and shop link.

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiMinus, FiBox, FiDroplet, FiFeather, FiGrid, FiPackage, FiChevronsRight, FiHeart } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback';
import { PRODUCT_IMAGES_BUCKET_ID, DATABASE_ID, USERS_COLLECTION_ID } from '../appwrite/constants';
import { useAuth } from '../context/AuthContext';
import { databases } from '../appwrite/config';

const categoryIcons = {
  'Grains': <FiBox size={20} />,
  'Oils': <FiDroplet size={20} />,
  'Vegetables': <FiFeather size={20} />,
  'Tubers': <FiGrid size={20} />,
  'Pasta': <FiPackage size={20} />,
  'Meat': <FiPackage size={20} />,
};

const PriceTrendIndicator = ({ current, previous }) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return null;
  if (current > previous) return <FiArrowUp className="text-orange-500" title="Price increased" />;
  if (current < previous) return <FiArrowDown className="text-green-500" title="Price decreased" />;
  return <FiMinus className="text-gray-400" title="Price stable" />;
};

const ProductCard = ({ product }) => {
  const { name, category, ownerPrice, previousOwnerPrice, $id, imageFileId, shop, shopOwnerId } = product;
  const icon = categoryIcons[category] || <FiPackage size={20} />;
  const { currentUser, setCurrentUser } = useAuth();

  const userFavorites = currentUser?.favoriteProductIds || [];
  const isFavorite = userFavorites.includes($id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;

    const newFavorites = isFavorite
      ? userFavorites.filter(id => id !== $id)
      : [...userFavorites, $id];

    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        currentUser.$id,
        { favoriteProductIds: newFavorites }
      );
      // Instantly update the UI by updating the context
      setCurrentUser(prev => ({ ...prev, favoriteProductIds: newFavorites }));
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full border border-gray-200/80 transform hover:-translate-y-2 transition-transform duration-300 group relative">
      {currentUser && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 bg-white/80 p-2 rounded-full transition-all z-10 ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <FiHeart style={{ fill: isFavorite ? 'currentColor' : 'none' }} />
        </button>
      )}
      <ImageWithFallback
        fileId={imageFileId}
        bucketId={PRODUCT_IMAGES_BUCKET_ID}
        fallbackText={name}
        className="w-full h-32 object-contain mb-4"
      />
      <div className="flex-grow">
        <p className="text-sm font-semibold text-gray-500 mb-1">{category}</p>
        <h3 className="text-lg font-bold text-gray-800 mb-2 h-14">{name}</h3>
      </div>
      <div className="mt-auto">
        <p className="text-sm text-gray-500">Starting from</p>
        <div className="flex items-center">
          <p className="text-2xl font-bold text-green-600 mr-2">
            {`₦${(ownerPrice || 0).toLocaleString()}`}
          </p>
          <PriceTrendIndicator current={ownerPrice} previous={previousOwnerPrice} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Sold by:
          <Link to={`/shop/${shopOwnerId}`} className="font-semibold text-blue-600 hover:underline ml-1">
            {shop}
          </Link>
        </p>
        <Link
          to={`/search?q=${encodeURIComponent(name)}`}
          className="group inline-flex items-center font-semibold text-green-600 hover:text-green-700 transition-colors mt-4"
        >
          View All Prices
          <FiChevronsRight className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
