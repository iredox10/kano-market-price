
// src/pages/ShopDetailsPage.js
// Displays a rich, detailed page for a single shop owner with a full review system.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../appwrite/config';
import { DATABASE_ID, SHOP_OWNERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID, REVIEWS_COLLECTION_ID } from '../appwrite/constants';
import { Query, ID } from 'appwrite';
import { useAuth } from '../context/AuthContext';
import ContactShopModal from '../components/ContactShopModal';
import ShopProductTable from '../components/ShopProductTable';
import StarRating from '../components/StarRating';
import { FiMapPin, FiClock, FiPhone, FiFacebook, FiInstagram, FiSend } from 'react-icons/fi';
import InfoModal from '../components/InfoModal';

const ReviewForm = ({ shopId, onReviewSubmit }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a rating.");
      return;
    }
    try {
      await databases.createDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        ID.unique(),
        {
          shopOwnerId: shopId,
          userId: currentUser.$id,
          userName: currentUser.name,
          rating: rating,
          comment: comment,
        }
      );
      // In a real app, a cloud function would then update the shop's average rating.
      onReviewSubmit();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  if (!currentUser) {
    return <p className="text-gray-600">Please <Link to="/login" className="text-green-600 font-semibold hover:underline">log in</Link> to leave a review.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h4 className="font-bold text-lg mb-2">Leave a Review</h4>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              className="text-2xl"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <FiStar className={`transition-colors ${(ratingValue <= (hoverRating || rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            </button>
          );
        })}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
        rows="3"
      ></textarea>
      <button type="submit" className="mt-2 inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
        <FiSend className="mr-2" /> Submit Review
      </button>
    </form>
  );
};


const ShopDetailsPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchShopData = async () => {
    try {
      const [shopRes, productsRes, reviewsRes] = await Promise.all([
        databases.getDocument(DATABASE_ID, SHOP_OWNERS_COLLECTION_ID, id),
        // CORRECTED: Query by 'shopOwnerId' instead of 'userId'
        databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.equal('shopOwnerId', id)]),
        databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [Query.equal('shopOwnerId', id)])
      ]);
      setShop(shopRes);
      setProducts(productsRes.documents);
      setReviews(reviewsRes.documents);
    } catch (error) {
      console.error("Failed to fetch shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading shop details...</p>;
  if (!shop) return <p className="text-center p-10">Shop not found.</p>;

  return (
    <>
      <ContactShopModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shop={shop} />
      <div className="bg-gray-50 min-h-screen">
        {/* Shop Header */}
        <section className="bg-white py-12 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <img src={shop.logoFileId || 'https://placehold.co/128x128/a7f3d0/14532d?text=Shop'} alt={shop.name} className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 md:mb-0 md:mr-8" />
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-800">{shop.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{shop.specialty}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start text-gray-500 mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2" />
                    <Link to={`/market/${shop.market.replace(/\s+/g, '-')}`} className="hover:text-green-600 hover:underline">
                      {shop.market}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{shop.openingHours}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-auto flex-shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-transform hover:scale-105"
                >
                  <FiPhone className="mr-3" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: About, Reviews, and Socials */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About {shop.name}</h3>
                <p className="text-gray-700 leading-relaxed">{shop.bio}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ratings & Reviews</h3>
                <div className="flex items-center mb-4">
                  <p className="text-4xl font-bold text-gray-800 mr-3">{shop.averageRating?.toFixed(1) || '0.0'}</p>
                  <div>
                    <StarRating rating={shop.averageRating || 0} />
                    <p className="text-sm text-gray-500">Based on {shop.reviewCount || 0} reviews</p>
                  </div>
                </div>
                <ReviewForm shopId={shop.$id} onReviewSubmit={fetchShopData} />
              </div>

              {(shop.socials?.facebook || shop.socials?.instagram) && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    {shop.socials.facebook && <a href={shop.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><FiFacebook size={24} /></a>}
                    {shop.socials.instagram && <a href={shop.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600"><FiInstagram size={24} /></a>}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Products and Review List */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Products from this Shop</h2>
                <ShopProductTable products={products} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">What People Are Saying</h2>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.$id} className="bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex justify-between">
                        <p className="font-bold">{review.userName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetailsPage;
